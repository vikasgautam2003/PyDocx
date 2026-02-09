

import os
from typing import List, TypedDict
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from app.core.vector_store import get_vector_store
from langgraph.graph import StateGraph, END

from langchain_community.tools import DuckDuckGoSearchRun

from duckduckgo_search import DDGS



import asyncio


from pydantic import BaseModel, Field
from typing import List



class AgentState(TypedDict):
    question: str
    file_id: str
    context: List[Document]
    answer: str
    web_context: str
    mode: str
    citations: List[dict]


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_retries=2,
)


class Flashcard(BaseModel):
    front: str = Field(description="The question or concept (Front of card)")
    back: str = Field(description="The answer or definition (Back of card)")


class FlashcardSet(BaseModel):
    cards: List[Flashcard]





# def web_search(state: AgentState):
#     # Only run if mode is "deep"
#     if state.get("mode") != "deep":
#         return {"web_context": ""}
        
#     print(f"🌍 [Agent] Deep Searching for: {state['question']}")
    
#     try:
#         # [!] DIRECT FIX: Use the installed package directly
#         # This bypasses LangChain's fragile wrapper
#         with DDGS() as ddgs:
#             # Search and get top 4 results
#             results = list(ddgs.text(state["question"], max_results=4))
            
#             if not results:
#                 return {"web_context": "No relevant web results found."}
                
#             # Format results into a readable string for the AI
#             formatted_results = "\n".join(
#                 [f"- {r['title']}: {r['body']} ({r['href']})" for r in results]
#             )
#             return {"web_context": formatted_results}

#     except Exception as e:
#         print(f"⚠️ Search Error: {e}")
#         # Return empty context so the app doesn't crash
#         return {"web_context": ""}



def web_search(state: AgentState):
    if state.get("mode") != "deep":
        return {"web_context": ""}
        
    print(f"🌍 [Agent] Deep Searching for: {state['question']}")
    
    try:
        # [!] FIX: Add backend="html" to bypass the 202 Ratelimit
        with DDGS() as ddgs:
            results = list(ddgs.text(
                state["question"], 
                max_results=4,
                backend="html"  # <--- THIS IS THE KEY FIX
            ))
            
            if not results:
                return {"web_context": "No relevant web results found."}
                
            formatted_results = "\n".join(
                [f"- {r['title']}: {r['body']} ({r['href']})" for r in results]
            )
            return {"web_context": formatted_results}
            
    except Exception as e:
        print(f"⚠️ Search Error: {e}")
        return {"web_context": ""} # Fail gracefully




async def generate_flashcards(file_id: str):
    print(f"🃏 [Flashcards] Generating study set for {file_id}...")
    
    vector_store = get_vector_store(namespace=file_id)

    try:
        db_result = vector_store.get(limit=15)
        if db_result and db_result['documents']:
            docs = [
                Document(page_content=txt)
                for txt in db_result['documents']
            ]
        else:
            return {"cards": []}
    except Exception as e:
        print(f"⚠️ Flashcard Fetch Error: {e}")
        return {"cards": []}

    context_text = "\n\n".join([d.page_content for d in docs])[:6000]

    template = """You are an expert tutor. 
    Create a set of 8-10 high-quality flashcards to help a student learn this document.
    
    Focus on:
    - Key definitions (What is X?)
    - Important dates or figures.
    - Core concepts and their explanations.
    - Keep the "Front" short (under 15 words).
    - Keep the "Back" clear and concise (under 40 words).
    
    Document Excerpt:
    {context}
    """
    
    structured_llm = llm.with_structured_output(FlashcardSet)
    
    try:
        response = await structured_llm.ainvoke(template.format(context=context_text))
        return response.dict()
    except Exception as e:
        print(f"⚠️ Flashcard LLM Error: {e}")
        return {"cards": []}




async def generate_document_briefing(file_id: str):
    print(f"📊 [Briefing] Generating summary for {file_id}...")

    vector_store = get_vector_store(namespace=file_id)
    docs = []

    for attempt in range(15):
        try:
            db_result = vector_store.get(limit=10)

            if db_result and db_result['documents'] and len(db_result['documents']) > 0:
                print(f"✅ Found data on attempt {attempt+1}")

                docs = [
                    Document(page_content=txt, metadata=meta)
                    for txt, meta in zip(db_result['documents'], db_result['metadatas'])
                ]
                break

        except Exception as e:
            print(f"⚠️ Attempt {attempt+1} check failed: {e}")

        print(f"⏳ API waiting for Worker... (Attempt {attempt+1}/5)")
        await asyncio.sleep(2)

    if not docs:
        print("❌ No documents found after retries. Worker is too slow or failed.")
        return {
            "summary": ["Processing is taking longer than expected."],
            "suggested_questions": ["Please wait a moment and try asking a question."]
        }

    context_text = "\n\n".join([d.page_content for d in docs])[:4000]

    template = """You are a senior analyst. 
    Analyze the following document excerpt and provide a structured briefing.
    
    Document Excerpt:
    {context}
    
    Output strictly in JSON format with these fields:
    - "summary": A list of 3 concise bullet points summarizing the key themes.
    - "suggested_questions": A list of 3 specific, interesting questions a user might ask about this text.
    """

    class Briefing(BaseModel):
        summary: List[str] = Field(description="3 bullet points summary")
        suggested_questions: List[str] = Field(description="3 suggested follow-up questions")

    structured_llm = llm.with_structured_output(Briefing)

    try:
        response = await structured_llm.ainvoke(template.format(context=context_text))
        return response.dict()
    except Exception as e:
        print(f"⚠️ Briefing LLM Error: {e}")
        return {
            "summary": ["Could not generate summary."],
            "suggested_questions": ["What is this document about?"]
        }



def retrieve(state: AgentState):
    print(f"🔍 [Agent] Retrieving context for: {state['question']}")
    vector_store = get_vector_store(namespace=state["file_id"])
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(state["question"])
    return {"context": docs}


# def generate(state: AgentState):
#     print(f"💡 [Agent] Generating answer...")

#     docs = state["context"]
#     citations = []

#     for doc in docs:
#         page_idx = doc.metadata.get("page", 0)
#         readable_page = int(page_idx) + 1
#         snippet = doc.page_content.replace("\n", " ").strip()[:150]

#         citations.append({
#             "page": readable_page,
#             "text": snippet
#         })

#     unique_citations = []
#     seen = set()

#     for c in citations:
#         signature = (c["page"], c["text"])
#         if signature not in seen:
#             seen.add(signature)
#             unique_citations.append(c)

#     unique_citations.sort(key=lambda x: x["page"])


#     context_text = "\n\n".join([d.page_content for d in state["context"]])
#     web_text = state.get("web_context", "")

#     full_context = f"PDF CONTENT:\n{context_text}\n\nWEB CONTENT:\n{web_text}"
   
#     mode = state.get("mode", "standard")

#     if mode == "nemesis":
#         template = """You are 'The Nemesis', a ruthless, hyper-critical auditor and devil's advocate.
        
#         Your Goal: 
#         - Do NOT just answer the question. 
#         - Attack the premise. Find what is MISSING from the context.
#         - Highlight risks, logical fallacies, or vague language in the document.
#         - Use your own external knowledge to point out industry standards that are absent here.
#         - Be direct, skeptical, and slightly aggressive. Use 🔴 emojis for risks.
        
#         Context from Document:
#         {context}

#         User Question: {question}
        
#         Analysis:
#         """

#         pass
#     elif mode == "deep":
        
#         template = """You are a Deep Research Assistant. 
#         You have access to both the uploaded document AND the web.
        
#         Your Goal: Answer the question comprehensively. 
#         - If the PDF has the answer, prioritize it.
#         - If the PDF is missing info (e.g. definitions, external facts), use the WEB CONTENT to fill the gaps.
#         - Explicitly mention when you are using external info (e.g. "According to web sources...").
        
#         Context:
#         {context}

#         Question: {question}
#         """

#     else:


#         template = """You are an expert teacher and technical assistant. 
#         Your goal is to answer the user's question clearly, accurately, and well-structured based *only* on the provided context.

#         structure your answer using Markdown formatting:
#         - Use **Bold** for key terms or important numbers.
#         - Use `## Headings` to separate different topics or sections.
#         - Use lists (- Item 1) for steps, features, or multiple points.
#         - If there is code, use code blocks.
#         - Be concise but thorough.

#         If the answer is not in the context, politely say you don't know.

#         Context:
#         {context}

#         Question: {question}
#         """

#     prompt = ChatPromptTemplate.from_template(template)
#     chain = prompt | llm | StrOutputParser()

#     response = chain.invoke({
#         "context": state["context"],
#         "question": state["question"]
#     })

#     return {
#         "answer": response,
#         "citations": unique_citations
#     }


def generate(state: AgentState):
    print(f"💡 [Agent] Generating answer in {state.get('mode', 'standard')} mode...")

    # 1. Process Citations
    docs = state["context"]
    citations = []

    for doc in docs:
        page_idx = doc.metadata.get("page", 0)
        readable_page = int(page_idx) + 1
        snippet = doc.page_content.replace("\n", " ").strip()[:150]

        citations.append({
            "page": readable_page,
            "text": snippet
        })

    unique_citations = []
    seen = set()

    for c in citations:
        signature = (c["page"], c["text"])
        if signature not in seen:
            seen.add(signature)
            unique_citations.append(c)

    unique_citations.sort(key=lambda x: x["page"])

    # 2. Prepare Context Strings
    # Convert list of documents to a single string for the prompt
    context_text = "\n\n".join([d.page_content for d in state["context"]])
    web_text = state.get("web_context", "")

    # Default context input (just PDF)
    final_context_input = context_text 

    mode = state.get("mode", "standard")

    # 3. Select Prompt & Context based on Mode
    if mode == "nemesis":
        template = """You are 'The Nemesis', a ruthless, hyper-critical auditor and devil's advocate.
        
        Your Goal: 
        - Do NOT just answer the question. 
        - Attack the premise. Find what is MISSING from the context.
        - Highlight risks, logical fallacies, or vague language in the document.
        - Use your own external knowledge to point out industry standards that are absent here.
        - Be direct, skeptical, and slightly aggressive. Use 🔴 emojis for risks.
        
        Context from Document:
        {context}

        User Question: {question}
        
        Analysis:
        """

    elif mode == "deep":
        # [!] CRITICAL FIX: Use Combined Context (PDF + Web) for Deep Mode
        final_context_input = f"PDF CONTENT:\n{context_text}\n\nWEB CONTENT:\n{web_text}"
        
        template = """You are a Deep Research Assistant. 
        You have access to both the uploaded document AND the web.
        
        Your Goal: Answer the question comprehensively. 
        - If the PDF has the answer, prioritize it.
        - If the PDF is missing info (e.g. definitions, external facts), use the WEB CONTENT to fill the gaps.
        - Explicitly mention when you are using external info (e.g. "According to web sources...").
        
        Context:
        {context}

        Question: {question}
        """

    else:
        # Standard Mode
        template = """You are an expert teacher and technical assistant. 
        Your goal is to answer the user's question clearly, accurately, and well-structured based *only* on the provided context.

        structure your answer using Markdown formatting:
        - Use **Bold** for key terms or important numbers.
        - Use `## Headings` to separate different topics or sections.
        - Use lists (- Item 1) for steps, features, or multiple points.
        - If there is code, use code blocks.
        - Be concise but thorough.

        If the answer is not in the context, politely say you don't know.

        Context:
        {context}

        Question: {question}
        """

    # 4. Invoke LLM
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({
        "context": final_context_input, # [!] Passes the correct string (PDF or Combined)
        "question": state["question"]
    })

    return {
        "answer": response,
        "citations": unique_citations
    }


workflow = StateGraph(AgentState)

workflow.add_node("retrieve", retrieve)
workflow.add_node("web_search", web_search)
workflow.add_node("generate", generate)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "web_search")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

rag_app = workflow.compile()
