from fastapi import APIRouter, UploadFile, File, HTTPException
from app.agents.rag import process_document
import uuid
import shutil
import os
from langchain_community.document_loaders import PyPDFLoader

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDFs are allowed")

    file_id = str(uuid.uuid4())
    temp_path = f"/tmp/{file_id}.pdf"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        loader = PyPDFLoader(temp_path)
        pages = loader.load()
        full_text = "\n\n".join(p.page_content for p in pages)

        os.remove(temp_path)

        task = process_document.delay(file_id=file_id, text_content=full_text)

        return {
            "id": file_id,
            "filename": file.filename,
            "task_id": task.id,
            "message": "Processing started"
        }

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))
