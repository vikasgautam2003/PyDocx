# import os
# from typing import List, TypedDict
# from langchain_core.documents import Document
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.output_parsers import StrOutputParser
# from langchain_core.runnables import RunnablePassthrough
# from app.core.vector_store import get_vector_store
# from langgraph.graph import StateGraph, END



# class AgentState(TypedDict):
#     question: str
#     file_id: str
#     context: List[Document]
#     answer: str


# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.5-flash",
#     temperature=0,
#     max_retries=2,
# )



# def retrieve(state: AgentState):

#     print(f"🔍 [Agent] Retrieving context for: {state['question']}")

#     vector_store = get_vector_store(namespace=state['file_id'])
#     retriever = vector_store.as_retriever(search_kwargs={"k": 3})
#     docs = retriever.invoke(state["question"])
#     return {"context": docs}


# def generate(state: AgentState):
    
#     print(f"💡 [Agent] Generating answer...")
     

#     template = """You are a helpful assistant for Question-Answering tasks.
#     Use the following pieces of retrieved context to answer the question.
#     If you don't know the answer, just say that you don't know.
    
#     Context:
#     {context}

#     Question: {question}
#     """


#     prompt = ChatPromptTemplate.from_template(template)
#     chain = prompt | llm | StrOutputParser()

#     response = chain.invoke({
#         "context": state["context"],
#         "question": state["question"]
#     })

#     return {"answer": response}



# workflow = StateGraph(AgentState)


# workflow.add_node("retrieve", retrieve)
# workflow.add_node("generate", generate)

# workflow.set_entry_point("retrieve")
# workflow.add_edge("retrieve", "generate")
# workflow.add_edge("generate", END)


# rag_app = workflow.compile()








import os
from typing import List, TypedDict
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.core.vector_store import get_vector_store
from langgraph.graph import StateGraph, END


class AgentState(TypedDict):
    question: str
    file_id: str
    context: List[Document]
    answer: str
    citations: List[int]


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_retries=2,
)


def retrieve(state: AgentState):
    print(f"🔍 [Agent] Retrieving context for: {state['question']}")
    vector_store = get_vector_store(namespace=state['file_id'])
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(state["question"])
    return {"context": docs}


def generate(state: AgentState):
    print(f"💡 [Agent] Generating answer...")

    docs = state["context"]
    citations = []

    for doc in docs:
        page_idx = doc.metadata.get("page", 0)
        citations.append(int(page_idx) + 1)

    unique_citations = sorted(list(set(citations)))

    template = """You are a helpful assistant for Question-Answering tasks.
    Use the following pieces of retrieved context to answer the question.
    If you don't know the answer, just say that you don't know.
    
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
