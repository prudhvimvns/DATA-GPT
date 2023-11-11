# from fastapi import FastAPI, HTTPException, File, UploadFile
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from typing import Optional

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods
#     allow_headers=["*"],  # Allows all headers
# )

# class ChatRequest(BaseModel):
#     input_type: str
#     database_uri: Optional[str] = None
#     openai_api_key: str
#     user_input: str
# @app.get('/')
# async def default():
#     return {"Hi": "John", "John": "John"}
# @app.post("/chat")
# # async def chat_with_db(chat_request: ChatRequest, csv_file: Optional[UploadFile] = File(None)):
# async def chat_with_db(chat_request: ChatRequest):
#     # Your logic for chat with DB or CSV goes here
#     response = "Response from chatbot"
#     return {"response": response}





# from fastapi import FastAPI, HTTPException, UploadFile, File
# from pydantic import BaseModel
# from typing import Optional
# import os
# from langchain.agents import create_sql_agent, create_csv_agent
# from langchain.agents.agent_toolkits import SQLDatabaseToolkit
# from langchain.agents.agent_types import AgentType
# from fastapi.middleware.cors import CORSMiddleware
# from langchain.utilities import SQLDatabase
# from langchain.llms import OpenAI
# import tempfile

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods
#     allow_headers=["*"],  # Allows all headers
# )

# class ChatRequest(BaseModel):
#     input_type: str
#     database_uri: Optional[str] = None
#     openai_api_key: str
#     user_input: str

# @app.post("/chat")
# async def chat_with_db(chat_request: ChatRequest):
#     if chat_request.input_type == 'DB URI':
#         os.environ['OPENAI_API_KEY'] = chat_request.openai_api_key
#         db = SQLDatabase.from_uri(chat_request.database_uri)
#         llm = OpenAI(temperature=0, verbose=True)

#         agent_executor = create_sql_agent(
#             llm=llm,
#             toolkit=SQLDatabaseToolkit(db=db, llm=llm),
#             verbose=True,
#             agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#         )

#         response = agent_executor.run(chat_request.user_input)
#         return {"response": response}




# uvicorn app:app --reload








from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import os
from langchain.agents import create_sql_agent, create_csv_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.agents.agent_types import AgentType
from fastapi.middleware.cors import CORSMiddleware
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
import tempfile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ChatRequest(BaseModel):
    input_type: str
    database_uri: Optional[str] = None
    openai_api_key: str
    user_input: str
    temperature: float 

class Message(BaseModel):
    user: str
    text: str

chat_history = []  # In-memory storage for chat messages

@app.post("/chat")
async def chat_with_db(chat_request: ChatRequest):
    if chat_request.input_type == 'DB URI':
        os.environ['OPENAI_API_KEY'] = chat_request.openai_api_key
        db = SQLDatabase.from_uri(chat_request.database_uri)
        llm = OpenAI(temperature=chat_request.temperature, verbose=True)

        agent_executor = create_sql_agent(
            llm=llm,
            toolkit=SQLDatabaseToolkit(db=db, llm=llm),
            verbose=True,
            agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        )

        response = agent_executor.run(chat_request.user_input)

        # Save the chat message to the in-memory storage
        chat_history.append(Message(user="User", text=chat_request.user_input))
        chat_history.append(Message(user="Bot", text=response))

        return {"response": response}

@app.get("/get_chat_history")
async def get_chat_history():
    return chat_history






# from fastapi import FastAPI, HTTPException, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional
# import os
# from langchain.agents import create_sql_agent, create_csv_agent
# from langchain.agents.agent_toolkits import SQLDatabaseToolkit
# from langchain.agents.agent_types import AgentType
# from langchain.utilities import SQLDatabase
# from langchain.llms import OpenAI
# import tempfile

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods
#     allow_headers=["*"],  # Allows all headers
# )

# class ChatRequest(BaseModel):
#     input_type: str
#     database_uri: Optional[str] = None
#     openai_api_key: str
#     user_input: str

# @app.get("/")
# async def default():
#     return {"HI":"msg"}

# @app.post("/chat")
# async def chat_with_db(chat_request: ChatRequest):
#     print(chat_request)
#     if chat_request.input_type == 'DB URI':
#         os.environ['OPENAI_API_KEY'] = chat_request.openai_api_key
#         db = SQLDatabase.from_uri(chat_request.database_uri)
#         llm = OpenAI(temperature=0, verbose=True)

#         agent_executor = create_sql_agent(
#             llm=llm,
#             toolkit=SQLDatabaseToolkit(db=db, llm=llm),
#             verbose=True,
#             agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#         )

#         response = agent_executor.run(chat_request.user_input)
#         return {"response": response}

#     elif chat_request.input_type == 'CSV':
#         os.environ['OPENAI_API_KEY'] = chat_request.openai_api_key
#         llm = OpenAI(temperature=0, verbose=True)

#         # Save the uploaded file to a temporary location
#         with tempfile.NamedTemporaryFile(delete=False) as fp:
#             fp.write(csv_file.file.read())
#             temp_path = fp.name

#         # Create the CSV agent using the temporary file path
#         agent = create_csv_agent(
#             llm=llm,
#             path=temp_path,
#             verbose=True,
#             agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
#         )

#         response = agent.run(chat_request.user_input)
#         return {"response": response}
