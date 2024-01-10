__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

from fastapi import FastAPI, File, UploadFile, Form
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import chromadb
import uuid
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
client = chromadb.PersistentClient(path="./data")
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
)

embedding_model = OpenAIEmbeddings(openai_api_key=os.environ.get("OPENAI_API_KEY"))

def split_text(loader):
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)

    documents=loader.load()

    texts=text_splitter.split_documents(documents)

    return texts

def file_loader(file_name):
    # check file type
    if file_name.endswith('.pdf'):
        loader=PyPDFLoader(file_name)
    elif file_name.endswith('.docx'):
        loader=Docx2txtLoader(file_name)
    elif file_name.endswith('.txt'):
        loader=TextLoader(file_name)

    return loader
    

def create_document_embeddings(content_list):

    embeddings_list = embedding_model.embed_documents(content_list)

    return embeddings_list

def embed_query(query):

    embeddings_list = embedding_model.embed_query(query)

    return embeddings_list

@app.post("/ingest")
async def ingest(conversation_id: str = Form(...), file: UploadFile = File(...)):
   
    file_location = f"./files/{file.filename}"

    os.makedirs(os.path.dirname(file_location), exist_ok=True)

    with open(file_location, "wb") as file_object:
        file_object.write(await file.read())

    # ================================================================

    collection = client.get_or_create_collection(conversation_id)

    loader = file_loader(file_location)
    texts = split_text(loader)

    metadatas_list = []
    content_list = []

    for text in texts:
        content_list.append(text.page_content)
        metadatas_list.append(text.metadata)
    
    embeddings_list = create_document_embeddings(content_list)

    collection.add(
        embeddings=embeddings_list,
        documents=content_list,
        metadatas=metadatas_list,
        ids=[str(uuid.uuid4()) for _ in embeddings_list]
    )

    os.remove(file_location)

    return {
        "info": "success",
        "file_name": file.filename,
        "conversation_id": conversation_id
    }

@app.post("/query")
def query(conversation_id: str = Form(...), query: str = Form(...)):
    collection = client.get_or_create_collection(conversation_id)

    results_from_query = collection.query(
        query_embeddings=embed_query(query),
        n_results=5,
    )

    return {
        "results": results_from_query
    }


@app.get("/")
def read_root():
    return {"Hello": "World"}