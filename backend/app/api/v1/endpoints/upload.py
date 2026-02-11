# from fastapi import APIRouter, UploadFile, File, HTTPException
# # from app.agents.rag import process_document
# import uuid
# import shutil
# import os
# # from langchain_community.document_loaders import PyPDFLoader

# router = APIRouter()

# @router.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     if file.content_type != "application/pdf":
#         raise HTTPException(status_code=400, detail="Only PDFs are allowed")

#     file_id = str(uuid.uuid4())
#     temp_path = f"/tmp/{file_id}.pdf"

#     try:
#         from app.agents.rag import process_document
#         from langchain_community.document_loaders import PyPDFLoader
        
#         with open(temp_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         loader = PyPDFLoader(temp_path)
#         pages = loader.load()
#         full_text = "\n\n".join(p.page_content for p in pages)

#         os.remove(temp_path)

#         task = process_document.delay(file_id=file_id, text_content=full_text)

#         return {
#             "id": file_id,
#             "filename": file.filename,
#             "task_id": task.id,
#             "message": "Processing started"
#         }

#     except Exception as e:
#         if os.path.exists(temp_path):
#             os.remove(temp_path)
#         raise HTTPException(status_code=500, detail=str(e))






import os
import uuid
import io
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from langchain_community.document_loaders import PyPDFLoader
from app.schemas.document import DocumentResponse
from app.agents.rag import process_document 

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    if not file.content_type.startswith("application/pdf"):
        raise HTTPException(400, detail="Only PDF files are allowed.")
    
    file_id = str(uuid.uuid4())
    # Use a safe path that works in Docker/HuggingFace
    temp_path = os.path.abspath(f"temp_{file_id}.pdf")

    try: 
        # 1. Save the file temporarily
        content = await file.read()
        with open(temp_path, "wb") as buffer:
            buffer.write(content)
        
        # 2. Use PyPDFLoader (The one you liked!)
        loader = PyPDFLoader(temp_path)
        pages = loader.load()
        
        # Join the pages into one string
        full_text = "\n\n".join(p.page_content for p in pages)

        # 3. Cleanup the file immediately
        if os.path.exists(temp_path):
            os.remove(temp_path)

        # 4. Fallback check
        if not full_text.strip():
            print(f"⚠️ [API] No text extracted by PyPDFLoader from {file.filename}")
            full_text = "ERROR_EMPTY_OR_SCANNED_PDF"

        # 5. Send payload to Worker
        payload = {"file_id": file_id, "text_content": full_text}
        print(f"📡 [API] Extracted {len(full_text)} chars. Sending to worker...")
        
        task = process_document.delay(payload)

        return DocumentResponse(
            id=file_id,
            filename=file.filename,
            content_type=file.content_type,
            size=len(content),
            upload_date=datetime.utcnow(),
            status="pending",
            task_id=task.id
        )

    except Exception as e:
        # Emergency cleanup
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"🔥 [API] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))