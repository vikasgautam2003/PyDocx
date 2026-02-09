import { useState } from "react";

export type Citation = {
  page: number;
  text: string;
};

export type AgentStep = {
  id: number;
  type: "log" | "answer";
  content: string;
  status?: "pending" | "done";
  citations?: Citation[];
};

export function useAgent() {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const chat = async (query: string, fileId: string, mode: "standard" | "nemesis" | "deep" = "standard") => {
    setIsThinking(true);

    setSteps([
      { id: Date.now(), type: "log", content: "Initializing Agent...", status: "pending" }
    ]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, file_id: fileId, mode }),
      });

      const data = await response.json();

      setSteps(prev => [
        ...prev.map(s => ({ ...s, status: "done" as const })),
        { id: Date.now() + 1, type: "log", content: "Searching ChromaDB for context...", status: "done" },
        { id: Date.now() + 2, type: "log", content: "Retrieved relevant chunks from PDF...", status: "done" },
        { id: Date.now() + 3, type: "log", content: "Synthesizing answer with Gemini 1.5...", status: "done" },
      ]);

      setTimeout(() => {
        setSteps(prev => [
          ...prev,
          { id: Date.now() + 4, type: "answer", content: data.answer, citations: data.citations }
        ]);
        setIsThinking(false);
      }, 800);

    } catch (err) {
      setSteps(prev => [
        ...prev,
        { id: Date.now(), type: "log", content: "Error connecting to brain.", status: "done" }
      ]);
      setIsThinking(false);
    }
  };

  return { steps, isThinking, chat };
}
