import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.vector_store import get_vector_store


# async def ingest_document(file_path: str, file_id: str):
#     try:
#         loader = PyPDFLoader(file_path)
#         pages = loader.load()


#         text_splitter = RecursiveCharacterTextSplitter(
#             chunk_size = 1000,
#             chunk_overlap = 200,
#             add_start_index = True
#         )

#         chunks = text_splitter.split_documents(pages)

#         for chunk in chunks:
#             chunk.metadata["file_id"] = file_id
#             chunk.metadata["source"] = os.path.basename(file_path)

#         vector_store = get_vector_store(namespace=file_id)
#         vector_store.add_documents(chunks)

#         return {"status": "success", "chunks_count": len(chunks)}

#     except Exception as e:
#         print(f"❌ Error processing document {file_id}: {str(e)}")
#         raise e    




async def ingest_document(file_id: str, text_content: str):
    """
    Receives raw text -> Splits -> Embeds
    """
    print(f"⚙️ [Logic] Starting ingestion for {file_id}...")
    
    # Lazy imports
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from app.core.vector_store import get_vector_store
    from langchain_core.documents import Document

    try:
        # 1. Split the text directly
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True
        )

        # Create Document objects from the text
        docs = [Document(page_content=text_content, metadata={"file_id": file_id})]
        chunks = text_splitter.split_documents(docs)

        # 2. Store in Vector DB
        vector_store = get_vector_store(namespace=file_id)
        vector_store.add_documents(chunks)

        print(f"✅ [Logic] Ingestion complete. {len(chunks)} chunks stored.")
        return {"status": "success", "chunks_count": len(chunks)}

    except Exception as e:
        print(f"❌ [Logic] Error processing document {file_id}: {str(e)}")
        raise e