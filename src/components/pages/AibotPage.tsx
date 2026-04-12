import { useCallback, useEffect, useRef } from "react";
import { useOllamaChat } from "../../hooks/useOllamaChat";
import { ChatMarkdown } from "../sections/ChatMarkdown";
import type { AibotPageContent } from "../../types/aibot";

type AibotPageProps = {
  content: AibotPageContent;
  initialQuestion?: string;
  onFallbackNavigate?: (route: string) => void;
};

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "offline" || status === "error"
      ? "aibot-dot aibot-dot--offline"
      : status === "connecting" || status === "streaming"
        ? "aibot-dot aibot-dot--connecting"
        : "aibot-dot aibot-dot--online";
  return <span className={cls} aria-hidden="true" />;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function AibotPage({ content, initialQuestion, onFallbackNavigate }: AibotPageProps) {
  const { messages, input, setInput, sendMessage, isStreaming, status, error, clearMessages, stopGeneration, retryConnection } =
    useOllamaChat();

  const initialSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!pageRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      pageRef.current.style.setProperty("--mouse-x", String(x));
      pageRef.current.style.setProperty("--mouse-y", String(y));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (initialQuestion && !initialSentRef.current && status === "idle") {
      initialSentRef.current = true;
      sendMessage(initialQuestion);
    }
  }, [initialQuestion, status, sendMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isStreaming) return;
    sendMessage();
  }, [input, isStreaming, sendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handlePillClick = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage]
  );

  const handleNewChat = useCallback(() => {
    clearMessages();
    initialSentRef.current = false;
    inputRef.current?.focus();
  }, [clearMessages]);

  const isWelcome = messages.length === 0;
  const isOffline = status === "offline";

  return (
    <div className="aibot-page" ref={pageRef}>
      {/* Background glow orbs */}
      <div className="aibot-glow" aria-hidden="true">
        <div className="aibot-glow__orb aibot-glow__orb--warm" />
        <div className="aibot-glow__orb aibot-glow__orb--green" />
        <div className="aibot-glow__orb aibot-glow__orb--pink" />
      </div>

      {isWelcome ? (
        /* ── Welcome State ── */
        <div className="aibot-hero">
          <div className="aibot-hero__icon" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          <h1 className="aibot-hero__heading">{content.welcomeHeading}</h1>

          {/* Input card */}
          <div className={`aibot-input-card${isOffline ? " aibot-input-card--disabled" : ""}`}>
            <div className="aibot-input-card__field">
              <StatusDot status={status} />
              <input
                ref={inputRef}
                className="aibot-input-card__input"
                type="text"
                aria-label="Ask about your consumer rights"
                placeholder={isOffline ? "Assistant is temporarily unavailable" : content.inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isOffline}
              />
              <button
                className="aibot-input-card__send"
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isOffline}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z" />
                </svg>
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          {/* Suggested pills */}
          <div className="aibot-pills">
            {content.suggestedPills.map((pill) => (
              <button
                key={pill}
                className="aibot-pill"
                type="button"
                onClick={() => handlePillClick(pill)}
                disabled={isOffline}
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="aibot-divider">
            <span className="aibot-divider__line" />
            <span className="aibot-divider__text">{content.questionsDivider}</span>
            <span className="aibot-divider__line" />
          </div>

          {/* Suggested scenario questions */}
          <div className="aibot-questions">
            {content.suggestedQuestions.map((q) => (
              <button
                key={q.text}
                className="aibot-question"
                type="button"
                onClick={() => handlePillClick(q.text)}
                disabled={isOffline}
              >
                <svg className="aibot-question__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span>{q.text}</span>
              </button>
            ))}
          </div>

          {/* Offline notice */}
          {isOffline ? (
            <div className="aibot-notice">
              <p className="aibot-notice__title">{content.offlineTitle}</p>
              <p className="aibot-notice__text">{content.offlineSubtext}</p>
              <div className="aibot-notice__actions">
                <button className="aibot-notice__retry" type="button" onClick={retryConnection}>
                  {content.offlineRetryLabel}
                </button>
                {content.offlineFallbackLinks.map((link) => (
                  <button
                    key={link.route}
                    className="aibot-notice__link"
                    type="button"
                    onClick={() => onFallbackNavigate?.(link.route)}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Trust badges */}
          <div className="aibot-trust">
            {content.trustBadges.map((badge) => (
              <span key={badge} className="aibot-trust__badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </div>

      ) : (
        /* ── Conversation State ── */
        <div className="aibot-conversation">
          <div className="aibot-conversation__header">
            <button className="aibot-conversation__new" type="button" onClick={handleNewChat}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>New conversation</span>
            </button>
          </div>

          <div className="aibot-conversation__messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`aibot-msg ${msg.role === "user" ? "aibot-msg--user" : "aibot-msg--ai"}`}
              >
                {msg.role === "assistant" ? (
                  <span className="aibot-msg__avatar" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                ) : null}
                <div className="aibot-msg__body">
                  <div className="aibot-msg__bubble">
                    {msg.role === "assistant" ? (
                      msg.content ? (
                        <ChatMarkdown content={msg.content} />
                      ) : isStreaming ? (
                        <span className="aibot-typing" aria-label="Thinking">
                          <span /><span /><span />
                        </span>
                      ) : null
                    ) : (
                      msg.content
                    )}
                  </div>
                  <span className="aibot-msg__time">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            ))}

            {error ? (
              <div className="aibot-error">
                <p>{error}</p>
                <div className="aibot-error__actions">
                  <button type="button" onClick={retryConnection}>Try again</button>
                  <button type="button" onClick={handleNewChat}>New conversation</button>
                </div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom input */}
          <div className="aibot-conversation__input">
            <div className={`aibot-input-card${isOffline ? " aibot-input-card--disabled" : ""}`}>
              <div className="aibot-input-card__field">
                <StatusDot status={status} />
                <input
                  ref={inputRef}
                  className="aibot-input-card__input"
                  type="text"
                  aria-label="Ask about your consumer rights"
                  placeholder={content.inputPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isOffline}
                />
                {isStreaming ? (
                  <button className="aibot-input-card__stop" type="button" onClick={stopGeneration} aria-label="Stop generating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="aibot-input-card__send"
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() || isOffline}
                    aria-label="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="aibot-input-disclaimer">{content.inputDisclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
}
