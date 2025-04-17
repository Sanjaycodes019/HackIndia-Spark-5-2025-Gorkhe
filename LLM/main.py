from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import requests
import json
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Women Safety Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    system_prompt: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024

class ChatResponse(BaseModel):
    content: str
    role: str = "assistant"

SAFETY_SYSTEM_PROMPT = """
You are a supportive and informative assistant focused on women's safety. When someone faces an unsafe situation, provide:
1. Calm, clear, and practical advice for immediate action
2. Information about resources they can access
3. Guidance on how to get help quickly when needed

Be concise, empathetic, and prioritize safety. Provide location-relevant advice when possible.
If the situation is an emergency, always advise calling emergency services (like 911, 112, or local equivalents) first.
"""

@app.post("/chat", response_model=ChatResponse)
async def process_chat(request: ChatRequest):
    try:
        system_prompt = request.system_prompt if request.system_prompt else SAFETY_SYSTEM_PROMPT
        
        formatted_messages = []
        
        formatted_messages.append({"role": "system", "content": system_prompt})
        
        for msg in request.messages:
            if msg.role not in ["user", "assistant", "system"]:
                msg.role = "user" 
            
            formatted_messages.append({"role": msg.role, "content": msg.content})
        
        prompt_data = {
            "model": "llama3:8b",  
            "messages": formatted_messages,
            "stream": False,
            "temperature": request.temperature,
            "max_tokens": request.max_tokens
        }
        
        logger.info("Sending request to Ollama")
        try:
            ollama_response = requests.post(
                "http://localhost:11434/api/chat",
                json=prompt_data,
                timeout=100
            )
            
            ollama_response.raise_for_status()
            
            response_data = ollama_response.json()
            logger.info(f"Received response from Ollama: {response_data}")
            
            if "message" not in response_data or "content" not in response_data.get("message", {}):
                logger.error(f"Unexpected response structure from Ollama: {response_data}")
                return ChatResponse(content="I'm sorry, there was an issue processing your request. Please try again later.")
            
            return ChatResponse(content=response_data["message"]["content"])
            
        except requests.exceptions.RequestException as req_err:
            logger.error(f"Request to Ollama failed: {req_err}")
            raise HTTPException(status_code=503, detail=f"Failed to connect to LLM service: {str(req_err)}")
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return ChatResponse(content=f"An error occurred while processing your request: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    try:
        response = requests.get("http://localhost:11434/api/version", timeout=5)
        if response.status_code == 200:
            return {"status": "online", "ollama": "connected"}
        else:
            return {"status": "online", "ollama": "disconnected"}
    except:
        return {"status": "online", "ollama": "disconnected"}

@app.post("/emergency")
async def emergency_response(request: Request):
    data = await request.json()
    situation = data.get("situation", "")
    location = data.get("location", "")
    
    emergency_prompt = f"""
    Emergency situation: {situation}
    Location: {location}
    
    Provide immediate, clear safety instructions and information about local emergency resources.
    """
    
    chat_request = ChatRequest(
        messages=[Message(role="user", content=emergency_prompt)],
        system_prompt="EMERGENCY RESPONSE MODE: Provide only critical, potentially life-saving information. Be extremely concise and action-oriented.",
        temperature=0.3 
    )
    
    response = await process_chat(chat_request)
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)