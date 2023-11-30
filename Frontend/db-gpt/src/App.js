import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const [databaseUri, setDatabaseUri] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0); // Initial temperature value
  const [isVerbose, setIsVerbose] = useState(false);

  const chatContainerRef = useRef(null);
  const scrollToBottom = useRef(null);

  const inputType = 'DB URI';

  useEffect(() => {
    // Reset the state of other fields when inputType changes
    setDatabaseUri('');
    setOpenaiApiKey('');
    setUserInput('');
    setResponse('');
    setChatHistory([]);
    sessionStorage.clear();
  }, [inputType]);


  useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);


  useEffect(() => {
    const storedChatHistory = sessionStorage.getItem('chatHistory');
    if (storedChatHistory) {
      setChatHistory(JSON.parse(storedChatHistory));
    }
  }, []);


  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);


  useEffect(() => {
    // Scroll to the bottom when chatHistory changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // const LoadingAnimation = () => {
  //   return (
  //     <div className="loading-animation">
  //       <img src="/Applications/XAMPP/xamppfiles/htdocs/DATA-GPT/Frontend/db-gpt/src/loadings.gif" alt="Loading..." />
  //       <div className="loading-text">Loading...</div>
  //     </div>
  //   );
  // };
  const LoadingAnimation = () => {
    return (
        <div >
            <img className="loading-animation" src={require('./loadings.gif')} alt="Loading..." style={{ height: '100px',width: '200px' }}/>
        </div>
    );
  };

  const validInput = () =>{
    // if(inputType!=="" && databaseUri!=="" && openaiApiKey!==""){
      if(openaiApiKey!==""){

      chatWithDb();
    }
    else{
      alert("Enter valid details");
    }

  }

  const chatWithDb = async () => {
    setIsLoading(true);
    setDatabaseUri('postgresql://postgres:rootroot@polldb.crenldggkc0j.us-east-1.rds.amazonaws.com');
    try {
      // const res = await axios.post('http://ec2-3-94-212-26.compute-1.amazonaws.com:8000/chat', {
        const res = await axios.post('http://localhost:8000/chat', {
        input_type: inputType,
        database_uri: databaseUri,
        openai_api_key: openaiApiKey,
        user_input: userInput,
        temperature: temperature, // Send the temperature value
        verbose: !isVerbose,
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      // Fetch chat history after sending a message
      getChatHistory();
      setUserInput('');
    }
  };

  const handleTemperatureChange = (e) => {
    setTemperature(e.target.value);
  };

  const handleVerboseChange = () =>{
    console.log(!isVerbose);
    setIsVerbose(!isVerbose);
  }

  const onHandleInput = (event)=>{
    if(event.key==='Enter'){
      validInput();
    }
  }

  const getChatHistory = async () => {
    try {
      // const res = await axios.get('http://ec2-3-94-212-26.compute-1.amazonaws.com:8000/get_chat_history');
      const res = await axios.get('http://localhost:8000/get_chat_history');
      setChatHistory(res.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <div className="container OuterContainer">
        {/* <div className="OuterContainer"></div> */}
        <h1 className="title">DB-GPT</h1>


        <div className="row">
          {/* <div className="dbapiInput">
              <input className="margin20" type="text" value={databaseUri} onChange={e => setDatabaseUri(e.target.value)} placeholder="Database URI🔗" />
          </div> */}
          <div className="dbapiInput">
              <input className="margin20" type="password" value={openaiApiKey} onChange={e => setOpenaiApiKey(e.target.value)} placeholder="OPENAI API Key🔑" />
          </div>
        </div>


      <div className="row width100">
          <div className="responseClass chat-container" ref={chatContainerRef}>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={message.user === 'User' ? 'user-message' : 'bot-message'}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <LoadingAnimation />}
            <div ref={scrollToBottom}></div>
          </div>
      </div>


      
        {openaiApiKey ?
          <div className="row width100">
                <div className="col-sm tempClass">

                  {/* Add the temperature slider */}
                  <div className="row">
                    <div className="dbapiInput">
                      <label htmlFor="temperatureSlider" className="form-label margin20">
                        Temperature 🌡️: {temperature}
                      </label>
                      <input type="range" className="form-range" id="temperatureSlider" min="0" max="1" step="0.5" value={temperature} onChange={handleTemperatureChange}/>
                    </div>
                  </div>
                </div>

            <div className="col-sm verboseClass">

              <div class="form-check form-switch">
                <label class="form-check-label" for="flexSwitchCheckChecked">Verbose 🐞</label>
                <input class="form-check-input" type="checkbox" onChange={handleVerboseChange} id="flexSwitchCheckChecked"/>
              </div>

            </div>

                <div className="dbapiInput">
                  <input className="margin20" type="text" value={userInput} id="inputTextBox" name="inputTextBox" onChange={e => setUserInput(e.target.value)} onKeyPress={onHandleInput} placeholder="Your question🙋‍♂️" />
                </div>          
                <div className="chatButton">
                  <button type="button" className="margin20 chatButtonClass btn btn-primary chatButton" onClick={validInput}>Chat 💬</button>
              </div>
          </div>:<div></div>}
      </div>
    </div>
  );
}

export default App;
