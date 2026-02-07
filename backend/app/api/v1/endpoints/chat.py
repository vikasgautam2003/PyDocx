



from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
from app.agents.rag import rag_app
from app.agents.rag import rag_app, generate_document_briefing




router = APIRouter()

class Citation(BaseModel):
    page: int
    text: str


class BriefingResponse(BaseModel):
    summary: List[str]
    suggested_questions: List[str]





class ChatRequest(BaseModel):
    query: str
    file_id: str


class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation] = []


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        result = await rag_app.ainvoke({
            "question": request.query,
            "file_id": request.file_id
        })

        return ChatResponse(
            answer=result["answer"],
            citations=result.get("citations", [])
        )

    except Exception as e:
        print(f"🔥 Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))






@router.post("/analyze", response_model=BriefingResponse)
async def analyze_document(request: ChatRequest):
    
    try:
        briefing = await generate_document_briefing(request.file_id)
        return BriefingResponse(
            summary=briefing["summary"],
            suggested_questions=briefing["suggested_questions"]
        )
    except Exception as e:
        print(f"🔥 Error in analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))