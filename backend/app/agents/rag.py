

import os
from typing import List, TypedDict
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from app.core.vector_store import get_vector_store
from langgraph.graph import StateGraph, END

from pydantic import BaseModel, Field
from typing import List



class AgentState(TypedDict):
    question: str
    file_id: str
    context: List[Document]
    answer: str
    citations: List[dict]


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_retries=2,
)



async def generate_document_briefing(file_id: str):
    print(f"📊 [Briefing] Generating summary for {file_id}...")

    vector_store = get_vector_store(namespace=file_id)
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    docs = await retriever.ainvoke("introduction summary abstract overview")

    context_text = "\n\n".join([d.page_content for d in docs])[:4000]

    template = """You are a senior analyst. 
    Analyze the following document excerpt and provide a structured briefing.
    
    Document Excerpt:
    {context}
    
    Output strictly in JSON format with these fields:
    - "summary": A list of 3 concise bullet points summarizing the key themes.
    - "suggested_questions": A list of 3 specific, interesting questions a user might ask about this text.
    
    JSON:
    """

    
   

    class Briefing(BaseModel):
        summary: List[str] = Field(description="3 bullet points summary")
        suggested_questions: List[str] = Field(description="3 suggested follow-up questions")

    structured_llm = llm.with_structured_output(Briefing)

    try:
        response = await structured_llm.ainvoke(template.format(context=context_text))
        return response.dict()
    except Exception as e:
        print(f"⚠️ Briefing Error: {e}")
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


def generate(state: AgentState):
    print(f"💡 [Agent] Generating answer...")

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

    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()

    response = chain.invoke({
        "context": state["context"],
        "question": state["question"]
    })

    return {
        "answer": response,
        "citations": unique_citations
    }


workflow = StateGraph(AgentState)

workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)

workflow.set_entry_point("retrieve")
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

rag_app = workflow.compile()
