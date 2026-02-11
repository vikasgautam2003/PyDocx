# import os
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from app.core.vector_store import get_vector_store
# import re
# from langchain_core.documents import Document
# import asyncio


# def sanitize_collection_name(name: str) -> str:
#     if not name: return ""
#     name = os.path.basename(name)               # Remove folder path
#     name = os.path.splitext(name)[0]            # Remove extension
#     name = re.sub(r'[^a-zA-Z0-9._-]', '_', name)# Remove special chars
#     name = name.strip('._-')                    # Remove leading/trailing
#     return name[:63]                            # Limit length

# async def ingest_document(file_id: str, text_content: str):
#     print(f"⚙️ [Ingestion] Starting for raw ID: {file_id}...")
    
#     # [!] 2. Sanitize the ID
#     clean_id = sanitize_collection_name(file_id)
#     print(f"🧹 [Ingestion] Sanitized ID: '{file_id}' -> '{clean_id}'")

#     try:
#         # Split text
#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size=1000,
#             chunk_overlap=200,
#             add_start_index=True
#         )

#         docs = [Document(page_content=text_content, metadata={"file_id": clean_id})]
#         chunks = text_splitter.split_documents(docs)

#         # [!] 3. Save to Vector DB using CLEAN ID
#         vector_store = get_vector_store(namespace=clean_id)
#         vector_store.add_documents(chunks)

#         print(f"✅ [Ingestion] Success! Saved {len(chunks)} chunks to collection '{clean_id}'.")
#         return {"status": "success", "chunks_count": len(chunks)}

#     except Exception as e:
#         print(f"❌ [Ingestion] Error: {str(e)}")
#         raise e







import os
import re
import asyncio
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.core.vector_store import get_vector_store

def sanitize_collection_name(name: str) -> str:
    """
    Makes a string safe for ChromaDB collection names.
    Rules: 3-63 characters, Alphanumeric, underscores, hyphens, or periods.
    """
    if not name: return ""
    old_name = name
    # 1. Remove folder paths (e.g., "uploads/file.pdf" -> "file.pdf")
    name = os.path.basename(name)
    # 2. Remove extension (e.g., "file.pdf" -> "file")
    name = os.path.splitext(name)[0]
    # 3. Replace any invalid character with underscore
    name = re.sub(r'[^a-zA-Z0-9._-]', '_', name)
    # 4. Ensure it doesn't start/end with special chars
    name = name.strip('._-')
    clean_name = name[:63]
    print(f"🧹 [Ingestion Sanitizer] '{old_name}' -> '{clean_name}'")
    return clean_name

async def ingest_document(file_id: str, text_content: str):
    print(f"⚙️ [Ingestion] Starting process for raw ID: {file_id}")
    print(f"👷 [Worker] Task started for ID: {file_id}")
    print(f"👷 [Worker] Received text length: {len(text_content)}")
    
    if len(text_content) < 50:
        print(f"🚨 [Worker] WARNING: Text is suspicious! Content: '{text_content}'")
    
    # 1. Sanitize the ID to create the collection namespace
    clean_id = sanitize_collection_name(file_id)

    try:
        # 2. Split the text content into chunks
        print(f"📝 [Ingestion] Splitting text into chunks (Size: 1000, Overlap: 200)")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True
        )

        # Create Document objects with sanitized metadata
        docs = [Document(page_content=text_content, metadata={"file_id": clean_id})]
        chunks = text_splitter.split_documents(docs)
        print(f"📦 [Ingestion] Created {len(chunks)} chunks.")

        # 3. Initialize Vector Store with the sanitized namespace
        print(f"🔥 [Ingestion] Connecting to Vector Store namespace: '{clean_id}'")
        vector_store = get_vector_store(namespace=clean_id)
        
        # 4. Add documents to the store
        print(f"⬆️ [Ingestion] Uploading chunks to Chroma Cloud...")
        vector_store.add_documents(chunks)

        print(f"✅ [Ingestion] Success! Collection '{clean_id}' is ready.")
        return {"status": "success", "chunks_count": len(chunks)}

    except Exception as e:
        print(f"❌ [Ingestion] CRITICAL ERROR: {str(e)}")
        # Raise to ensure Celery task knows it failed
        raise e