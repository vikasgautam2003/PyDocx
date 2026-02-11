import io
import uuid
import pypdf
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.document import DocumentResponse
from app.agents.rag import process_document

router = APIRouter()

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...)):
    if not file.content_type.startswith("application/pdf"):
        raise HTTPException(400, detail="Only PDF files are allowed.")
    
    file_id = str(uuid.uuid4())

    try: 
        content = await file.read()
        pdf_stream = io.BytesIO(content)
        pdf_reader = pypdf.PdfReader(pdf_stream)
        
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"

        if not text.strip():
            text = "ERROR_EMPTY_OR_SCANNED_PDF"

        # Pack into the dictionary payload
        payload = {"file_id": file_id, "text_content": text}
        
        # Trigger task
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
        print(f"🔥 [API] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))