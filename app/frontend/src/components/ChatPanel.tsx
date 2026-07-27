import { useState } from "react";
import { sendMessage, type ChatMessage } from "../api/chat";
import Icon from "./Icon";

export default function ChatPanel({ petName }: { petName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendText = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || sending) return;

    const nextMessages = [...messages, { role: "user", content: text } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setSending(true);

    try {
      const { reply } = await sendMessage(nextMessages.slice(-20));
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      setError(`${petName} couldn't reply just now. Try sending that again.`);
    } finally {
      setSending(false);
    }
  };

  const handleSend = () => void sendText(input);

  return (
    <section className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-stone-300/80 bg-[#fbfaf7]">
      <div className="flex items-center gap-3 border-b border-stone-200 px-5 py-4">
        <div className="grid size-9 place-items-center rounded-full bg-[#f3e7df] text-[#a94f35]">
          <Icon name="message" className="size-4.5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-stone-800">Chat with {petName}</h2>
          <p className="text-xs text-stone-400">A little company goes a long way.</p>
        </div>
      </div>

      <div className="flex min-h-48 flex-1 flex-col gap-3 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.length === 0 && (
          <div className="flex max-w-[88%] items-start gap-2.5">
            <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-stone-200 bg-white text-[#a94f35]">
              <Icon name="paw" className="size-3.5" />
            </div>
            <div className="rounded-xl rounded-tl-sm bg-stone-100 px-3.5 py-2.5 text-sm leading-6 text-stone-600">
              How are you feeling today?
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-6 ${
              message.role === "user"
                ? "self-end rounded-tr-sm bg-[#a94f35] text-white"
                : "self-start rounded-tl-sm bg-stone-100 text-stone-700"
            }`}
          >
            {message.content}
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span className="size-1.5 animate-pulse rounded-full bg-stone-400" />
            {petName} is thinking...
          </div>
        )}
        {error && <p role="alert" className="text-xs leading-5 text-[#a94f35]">{error}</p>}
      </div>

      {messages.length === 0 && !sending && (
        <div className="flex flex-wrap gap-2 px-5 pb-4">
          {["Are you hungry?", "Want to play?", "How are you feeling?"].map((prompt) => (
            <button
              key={prompt}
              onClick={() => void sendText(prompt)}
              className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-600 transition hover:border-[#a94f35]/60 hover:text-[#8f422c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a94f35]"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-stone-200 p-3">
        <div className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white p-1.5 transition focus-within:border-[#a94f35] focus-within:ring-2 focus-within:ring-[#a94f35]/10">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) handleSend();
            }}
            placeholder="Type a message"
            aria-label={`Message ${petName}`}
            className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            aria-label="Send message"
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#a94f35] text-white transition hover:bg-[#8f422c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a94f35] disabled:bg-stone-200 disabled:text-stone-400"
          >
            <Icon name="send" className="size-4.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
