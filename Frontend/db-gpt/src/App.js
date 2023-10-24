// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;


// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [inputType, setInputType] = useState('DB URI');
//   const [databaseUri, setDatabaseUri] = useState('');
//   const [openaiApiKey, setOpenaiApiKey] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [response, setResponse] = useState('');

//   const chatWithDb = async () => {
//     const res = await axios.post('http://localhost:8000/chat', {
//       input_type: inputType,
//       database_uri: databaseUri,
//       openai_api_key: openaiApiKey,
//       user_input: userInput,
//     });
//     setResponse(res.data.response);
//   };

//   return (
//     <div className="App">
//       <select value={inputType} onChange={e => setInputType(e.target.value)}>
//         <option value="DB URI">DB URI</option>
//         <option value="CSV">CSV</option>
//       </select>
//       <input type="text" value={databaseUri} onChange={e => setDatabaseUri(e.target.value)} placeholder="Database URI" />
//       <input type="password" value={openaiApiKey} onChange={e => setOpenaiApiKey(e.target.value)} placeholder="OpenAI API Key" />
//       <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your question" />
//       <button onClick={chatWithDb}>Chat</button>
//       <p>{response}</p>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputType, setInputType] = useState('DB URI');
  const [databaseUri, setDatabaseUri] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [chatButtonClicked, setChatButtonClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const validateInput = () => {
    // Check if the database URI is valid.
    const isDatabaseUriValid = databaseUri.match(/^https?:\/\/[a-zA-Z0-9]+\.[a-zA-Z]+:[0-9]+\/[a-zA-Z0-9_]+$/);

    // Check if the OpenAI API key is valid.
    const isOpenaiApiKeyValid = openaiApiKey.match(/^sk-[a-zA-Z0-9]+$/);

    // Set the button state based on the validity of the input.
    setIsButtonDisabled(!isDatabaseUriValid || !isOpenaiApiKeyValid);
  };

  useEffect(() => {
    // Reset the state of other fields when inputType changes
    setDatabaseUri('');
    setOpenaiApiKey('');
    setUserInput('');
    setUploadedFile(null);
    setResponse('');
  }, [inputType]);

  const LoadingAnimation = () => {
    return (
      <div className="loading-animation">
        <img src="/loading-spinner.gif" alt="Loading..." />
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
      });
      setResponse(res.data.response);
      setChatButtonClicked(true);
      console.log("RESPONSEEE",response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">DB-GPT</h1>
        {/* <select value={inputType} onChange={e => setInputType(e.target.value)}>
          <option value="DB URI">DB URI</option>
          <option value="CSV">CSV</option>
        </select> */}
        <input type="text" value={databaseUri} onChange={e => setDatabaseUri(e.target.value)} placeholder="Database URI🔗" />
        <input type="password" value={openaiApiKey} onChange={e => setOpenaiApiKey(e.target.value)} placeholder="OPENAI API Key🔑" />
        <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your question🙋‍♂️" />
        <button onClick={chatWithDb}>Chat 💬</button>
        <div className="responseClass">
          {/* { chatButtonClicked ? 
            <p>RESPONSE: {response} {isLoading && <LoadingAnimation />} </p>: <p></p>
            } */}
            {chatButtonClicked && isLoading && <LoadingAnimation />}
                <p>RESPONSE: {response}</p>
            </div>
              <p>postgresql://prudhvisample:hGNBZu3xX1Ln@ep-solitary-sky-27823475.us-east-2.aws.neon.tech/neondb</p>
        <p>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</p>
              <p>who acted in Jailer movie?</p>
      </div>
    </div>
  );
}

export default App;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [inputType, setInputType] = useState('DB URI');
//   const [databaseUri, setDatabaseUri] = useState('');
//   const [openaiApiKey, setOpenaiApiKey] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [response, setResponse] = useState('');
//   const [uploadedFile, setUploadedFile] = useState(null);

//   useEffect(() => {
//     // Reset the state of other fields when inputType changes
//     setDatabaseUri('');
//     setOpenaiApiKey('');
//     setUserInput('');
//     setUploadedFile(null);
//     setResponse('');
//   }, [inputType]);

//   const chatWithDb = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('input_type', inputType);
//       formData.append('openai_api_key', openaiApiKey);
//       formData.append('user_input', userInput);
//       if (inputType === 'DB URI') {
//         formData.append('database_uri', databaseUri);
//       } else if (inputType === 'CSV') {
//         formData.append('csv_file', uploadedFile);
//       }
//       const res = await axios.post('http://localhost:8000/chat', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       setResponse(res.data.response);

//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="App">
//       <select value={inputType} onChange={e => setInputType(e.target.value)}>
//         <option value="DB URI">DB URI</option>
//         <option value="CSV">CSV</option>
//       </select>
//       {inputType === 'DB URI' ? (
//         <>
//           <input type="text" value={databaseUri} onChange={e => setDatabaseUri(e.target.value)} placeholder="Database URI" />
//           <input type="password" value={openaiApiKey} onChange={e => setOpenaiApiKey(e.target.value)} placeholder="OpenAI API Key" />
//         </>
//       ) : (
//         <>
//           <input type="file" onChange={e => setUploadedFile(e.target.files[0])} />
//           <input type="password" value={openaiApiKey} onChange={e => setOpenaiApiKey(e.target.value)} placeholder="OpenAI API Key" />
//         </>
//       )}
//       <input type="text" value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your question" />
//       <button onClick={chatWithDb}>Chat</button>
//       <p>{response}</p>
//       <p>postgresql://prudhvisample:hGNBZu3xX1Ln@ep-solitary-sky-27823475.us-east-2.aws.neon.tech/neondb</p>
//       <p>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</p>
//       <p>who acted in Jailer movie?</p>
//     </div>
//   );
// }

// export default App;
