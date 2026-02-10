from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import documents, chat
from app.api.v1.endpoints import documents

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 DocuNexus API Starting up...")
    yield
    print("🛑 DocuNexus API Shutting down...")


app = FastAPI(
    title="DocuNexus API",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url="/api/openapi.json",
    docs_url="/api/docs",
    
)


app.include_router(documents.router, prefix="/api/v1", tags=["Documents"])
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])


origins = [
    "http://localhost:3000",                   # Local Development   # <--- YOUR VERCEL DOMAIN (Exact URL)
    "https://docunexusai.vercel.app/",            # (Optional) If you have a custom domain
    "*"                                        # (Temporary debug) allows EVERYONE.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/health")
def health_check():
    return {"status": "awake", "worker": "active"}