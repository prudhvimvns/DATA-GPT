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
    
  }, [inputType]);


  useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);


  useEffect(() => {
    // Scroll to the bottom when chatHistory changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const LoadingAnimation = () => {
    return (
      <div className="loading-animation">
        <img src="/loading.gif" alt="Loading..." />
        <div className="loading-text">Loading...</div>
      </div>
    );
  };

  const chatWithDb = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/chat', {
        input_type: inputType,
        database_uri: databaseUri,
        openai_api_key: openaiApiKey,
        user_input: userInput,
        temperature: temperature, // Send the temperature value
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


  const getChatHistory = async () => {
    try {
      const res = await axios.get('http://localhost:8000/get_chat_history');
      setChatHistory(res.data);
      console.log("RESSS:",res.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  return (
    <div className="App">
      <div className="container OuterContainer">
        {/* <div className="OuterContainer"></div> */}
        <h1 className="title">DB-GPT</h1>


        <div className="row">
          <div className="dbapiInput">
              <input className="margin20" type="text" value={databaseUri} onChange={e => setDatabaseUri(e.target.value)} placeholder="Database URI🔗" />
          </div>
          <div className="dbapiInput">
              <input className="margin20" type="password" value={openaiApiKey} onChange={e => setOpenaiApiKey(e.target.value)} placeholder="OPENAI API Key🔑" />
          </div>
        </div>


<div className="row">
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


      
        {openaiApiKey && databaseUri?
              <div className="row">

                        {/* Add the temperature slider */}
        <div className="row">
          <div className="dbapiInput">
            <label htmlFor="temperatureSlider" className="form-label margin20">
              Temperature: {temperature}
            </label>
            <input
              type="range"
              className="form-range"
              id="temperatureSlider"
              min="0"
              max="1"
              step="0.5"
              value={temperature}
              onChange={handleTemperatureChange}
            />
          </div>
        </div>



                <div className="dbapiInput">
                  <input className="margin20" type="text" value={userInput} id="inputTextBox" name="inputTextBox" onChange={e => setUserInput(e.target.value)} placeholder="Your question🙋‍♂️" />
                </div>          
                <div className="chatButton">
                  <button type="button" class="btn btn-primary chatButton" className="margin20" onClick={chatWithDb}>Chat 💬</button>
              </div>
          </div>:<div></div>}
        <p>who acted in Jailer movie?</p>
      </div>
    </div>
  );
}

export default App;
