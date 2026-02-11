



# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel, Field
# from typing import List, Optional
# from app.agents.rag import rag_app
# from app.agents.rag import rag_app, generate_document_briefing, generate_flashcards





# router = APIRouter()

# class Citation(BaseModel):
#     page: int
#     text: str



# class BriefingResponse(BaseModel):
#     summary: List[str]
#     suggested_questions: List[str]





# class ChatRequest(BaseModel):
#     query: str
#     file_id: str
#     mode: Optional[str] = "standard"


# class ChatResponse(BaseModel):
#     answer: str
#     citations: List[Citation] = []


# class FlashcardResponse(BaseModel):
#     cards: List[dict]



# @router.post("/chat", response_model=ChatResponse)
# async def chat_endpoint(request: ChatRequest):
#     try:
#         result = await rag_app.ainvoke({
#             "question": request.query,
#             "file_id": request.file_id,
#             "mode": request.mode
#         })

#         return ChatResponse(
#             answer=result["answer"],
#             citations=result.get("citations", [])
#         )

#     except Exception as e:
#         print(f"🔥 Error in chat: {e}")
#         raise HTTPException(status_code=500, detail=str(e))



 

# @router.post("/analyze", response_model=BriefingResponse)
# async def analyze_document(request: ChatRequest):
    
#     try:
#         briefing = await generate_document_briefing(request.file_id)
#         return BriefingResponse(
#             summary=briefing["summary"],
#             suggested_questions=briefing["suggested_questions"]
#         )
#     except Exception as e:
#         print(f"🔥 Error in analysis: {e}")
#         raise HTTPException(status_code=500, detail=str(e))
    



# @router.post("/flashcards", response_model=FlashcardResponse)
# async def get_flashcards(request: ChatRequest):
#     try:
#         result = await generate_flashcards(request.file_id)
#         return FlashcardResponse(cards=result.get("cards", []))
#     except Exception as e:
#         print(f"🔥 Flashcard Error: {e}")
#         raise HTTPException(status_code=500, detail=str(e))

   





from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import re

# Import your RAG components
from app.agents.rag import rag_app, generate_document_briefing, generate_flashcards

router = APIRouter()

# --- HELPER: Sanitize ID (Must match Ingestion Logic) ---
def sanitize_collection_name(name: str) -> str:
    """
    Makes a string safe for ChromaDB collection names.
    Same logic as ingestion.py to ensure keys match.
    """
    if not name: return ""
    name = os.path.basename(name)               # Remove folders
    name = os.path.splitext(name)[0]            # Remove extension
    name = re.sub(r'[^a-zA-Z0-9._-]', '_', name)# Remove special chars
    name = name.strip('._-')                    # Remove leading/trailing dots/dashes
    return name[:63]                            # Limit length

# --- MODELS ---
class Citation(BaseModel):
    page: int
    text: str

class BriefingResponse(BaseModel):
    summary: List[str]
    suggested_questions: List[str]

class ChatRequest(BaseModel):
    query: str = ""  # Default to empty for analyze/flashcards endpoints
    file_id: str
    mode: Optional[str] = "standard"

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation] = []

class FlashcardResponse(BaseModel):
    cards: List[dict]


# --- ENDPOINTS ---

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # [!] FIX: Sanitize the ID so it matches what is in the DB
        clean_id = sanitize_collection_name(request.file_id)
        print(f"🔍 [Chat] Looking for collection: '{clean_id}' (Raw: {request.file_id})")

        result = await rag_app.ainvoke({
            "question": request.query,
            "file_id": clean_id,  # <--- Pass CLEAN ID here
            "mode": request.mode
        })

        # Handle case where result is just a string (simple chain) or dict (complex chain)
        answer = result.get("answer", "") if isinstance(result, dict) else str(result)
        citations = result.get("citations", []) if isinstance(result, dict) else []

        return ChatResponse(
            answer=answer,
            citations=citations
        )

    except Exception as e:
        print(f"🔥 Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze", response_model=BriefingResponse)
async def analyze_document(request: ChatRequest):
    try:
        # [!] FIX: Sanitize ID here too
        clean_id = sanitize_collection_name(request.file_id)
        print(f"🔍 [Analyze] Analyzing collection: '{clean_id}'")

        briefing = await generate_document_briefing(clean_id) # <--- Pass CLEAN ID here
        
        return BriefingResponse(
            summary=briefing.get("summary", []),
            suggested_questions=briefing.get("suggested_questions", [])
        )
    except Exception as e:
        print(f"🔥 Error in analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/flashcards", response_model=FlashcardResponse)
async def get_flashcards(request: ChatRequest):
    try:
        # [!] FIX: Sanitize ID here too
        clean_id = sanitize_collection_name(request.file_id)
        print(f"🔍 [Flashcards] Generating for collection: '{clean_id}'")

        result = await generate_flashcards(clean_id) # <--- Pass CLEAN ID here
        
        return FlashcardResponse(cards=result.get("cards", []))
    except Exception as e:
        print(f"🔥 Flashcard Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))