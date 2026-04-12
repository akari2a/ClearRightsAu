import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, OllamaStatus } from "../types/aibot";

const SYSTEM_PROMPT =
  "You are ClearRights AI, a helpful assistant for consumer rights in Australia. " +
  "You help users understand scams, refunds, product safety, and rental disputes. " +
  "You provide clear, practical guidance — not legal advice. " +
  "Always recommend consulting official sources (ACCC, ScamWatch, Fair Trading) for serious matters. " +
  "Keep responses concise and action-oriented.";

const MOCK_RESPONSES: Record<string, string> = {
  scam: "Based on what you've described, this sounds like a common phone or text scam. Here's what I'd recommend:\n\n1. **Do not respond** to the message or call back\n2. **Do not click** any links or provide personal information\n3. **Report it** to Scamwatch at scamwatch.gov.au\n4. **Block the number** on your phone\n\nIf you've already shared any personal details, contact your bank immediately and change your passwords.\n\nFor more detailed guidance, check our Scam Check tool.",
  refund: "Under Australian Consumer Law, you may have the right to a refund, repair, or replacement if:\n\n- The product is **faulty or defective**\n- It **doesn't match** the description or sample\n- It's **not fit for purpose**\n\n**Recommended next steps:**\n1. Gather your receipt and any evidence (photos, emails)\n2. Contact the seller in writing first\n3. Clearly state the issue and what remedy you want\n4. If the seller refuses, you can contact your state's Fair Trading office\n\nNote: Change-of-mind returns are not guaranteed under the law, though many stores offer them as policy.",
  product: "Product safety is taken very seriously under Australian law. If you suspect a product is unsafe:\n\n1. **Stop using it** immediately\n2. **Keep the product** and packaging — don't throw it away\n3. **Check for recalls** at productsafety.gov.au\n4. **Report the issue** to the ACCC or your state's Fair Trading office\n5. **Contact the retailer** for a refund or replacement\n\nUnusual smells, overheating, sparks, or unexpected behaviour are all valid safety concerns worth reporting.",
  bond: "Bond disputes are one of the most common tenancy issues. Here's what you should know:\n\n- Landlords can only deduct for **damage beyond fair wear and tear**\n- The **condition report** (start and end of tenancy) is key evidence\n- You have the right to **dispute any deduction** you believe is unfair\n\n**Steps to take:**\n1. Request a **detailed breakdown** of the deduction in writing\n2. Compare with your move-in condition report\n3. Gather photos from when you moved out\n4. If unresolved, apply to your state's tenancy tribunal (e.g., NCAT in NSW)\n\nMany disputes can be resolved through clear, evidence-based communication.",
  default: "Thank you for your question. Based on the information you've provided, here are some general steps you can take:\n\n1. **Document everything** — keep receipts, screenshots, emails, and photos\n2. **Know your rights** — Australian Consumer Law protects buyers of goods and services\n3. **Contact the other party** in writing first — this creates a record\n4. **Seek help** if direct contact doesn't resolve the issue — Fair Trading offices in each state can assist\n\nWould you like to know more about a specific topic? I can help with scams, refunds, product safety, or rental disputes."
};

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getMockResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("scam") || q.includes("visa") || q.includes("phish") || q.includes("fraud") || q.includes("suspicious") || q.includes("call")) {
    return MOCK_RESPONSES.scam;
  }
  if (q.includes("refund") || q.includes("return") || q.includes("seller") || q.includes("refused") || q.includes("broken") || q.includes("faulty")) {
    return MOCK_RESPONSES.refund;
  }
  if (q.includes("unsafe") || q.includes("product") || q.includes("safety") || q.includes("hot") || q.includes("smell") || q.includes("defect")) {
    return MOCK_RESPONSES.product;
  }
  if (q.includes("bond") || q.includes("landlord") || q.includes("rent") || q.includes("tenant") || q.includes("deposit") || q.includes("lease")) {
    return MOCK_RESPONSES.bond;
  }
  return MOCK_RESPONSES.default;
}

async function simulateStream(text: string, onChunk: (accumulated: string) => void, signal: AbortSignal): Promise<void> {
  const words = text.split(" ");
  let accumulated = "";
  for (let i = 0; i < words.length; i++) {
    if (signal.aborted) return;
    accumulated += (i === 0 ? "" : " ") + words[i];
    onChunk(accumulated);
    await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
  }
}

type UseOllamaChatOptions = {
  model?: string;
};

const STORAGE_KEY = "clearrights-aibot-messages";

export function useOllamaChat({ model = "llama3.2" }: UseOllamaChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<OllamaStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const baseUrlRef = useRef<string | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const useMockRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* storage unavailable */ }
  }, [messages]);

  const detectBaseUrl = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/tags", { signal: AbortSignal.timeout(3000) });
      if (res.ok) return "/api";
    } catch { /* proxy not available */ }

    try {
      const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(3000) });
      if (res.ok) return "http://localhost:11434";
    } catch { /* direct not available */ }

    return null;
  }, []);

  const checkConnection = useCallback(async () => {
    setStatus("connecting");
    const url = await detectBaseUrl();
    baseUrlRef.current = url;
    useMockRef.current = !url;
    setStatus("idle");
    setError(null);
  }, [detectBaseUrl]);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = text ?? input.trim();
      if (!messageText) return;
      if (abortRef.current) return;

      const userMessage: ChatMessage = {
        id: makeId(),
        role: "user",
        content: messageText,
        createdAt: Date.now()
      };

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: "assistant",
        content: "",
        createdAt: Date.now()
      };

      const currentMessages = messagesRef.current;
      const updatedMessages = [...currentMessages, userMessage];
      setMessages([...updatedMessages, assistantMessage]);
      setInput("");
      setStatus("streaming");
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      // Use mock responses if Ollama is not available
      if (useMockRef.current || !baseUrlRef.current) {
        const mockText = getMockResponse(messageText);
        try {
          await simulateStream(mockText, (accumulated) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = { ...last, content: accumulated };
              }
              return copy;
            });
          }, controller.signal);
          setStatus("idle");
        } catch {
          setStatus("idle");
        } finally {
          abortRef.current = null;
        }
        return;
      }

      // Real Ollama streaming
      const apiMessages = [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...updatedMessages.map((m) => ({ role: m.role, content: m.content }))
      ];

      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      try {
        const res = await fetch(`${baseUrlRef.current}/v1/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: apiMessages, stream: true }),
          signal: controller.signal
        });

        if (!res.ok) {
          // Fallback to mock if Ollama fails
          useMockRef.current = true;
          const mockText = getMockResponse(messageText);
          await simulateStream(mockText, (accumulated) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last && last.role === "assistant") {
                copy[copy.length - 1] = { ...last, content: accumulated };
              }
              return copy;
            });
          }, controller.signal);
          setStatus("idle");
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError("No response stream");
          setStatus("error");
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";

        timeoutId = setTimeout(() => {
          controller.abort();
          setError("Response timed out.");
          setStatus("error");
        }, 30000);

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            controller.abort();
            setError("Response timed out.");
            setStatus("error");
          }, 30000);

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                const finalContent = accumulated;
                setMessages((prev) => {
                  const copy = [...prev];
                  const last = copy[copy.length - 1];
                  if (last && last.role === "assistant") {
                    copy[copy.length - 1] = { ...last, content: finalContent };
                  }
                  return copy;
                });
              }
            } catch { /* skip malformed */ }
          }
        }

        setStatus("idle");
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setStatus((prev) => (prev === "error" ? "error" : "idle"));
        } else {
          setError("Connection lost.");
          setStatus("error");
        }
      } finally {
        clearTimeout(timeoutId);
        abortRef.current = null;
      }
    },
    [input, model, detectBaseUrl]
  );

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus("idle");
  }, []);

  const clearMessages = useCallback(() => {
    stopGeneration();
    setMessages([]);
    setError(null);
    setStatus("idle");
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, [stopGeneration]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isStreaming: status === "streaming",
    status,
    error,
    clearMessages,
    stopGeneration,
    retryConnection: checkConnection
  };
}
