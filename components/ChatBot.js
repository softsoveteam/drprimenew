"use client";

import { useEffect, useRef, useState } from "react";
import { usePublicBotQuestions } from "@/hooks/usePublicBotQuestions";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [levels, setLevels] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [replying, setReplying] = useState(false);
  const listRef = useRef(null);
  const timers = useRef([]);

  const { data: questions = [], isLoading, isError, refetch, isFetching } =
    usePublicBotQuestions(open);

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open, isLoading, levelIndex]);

  const lists = levels?.length ? levels : [questions];
  const currentList = Array.isArray(lists[levelIndex]) ? lists[levelIndex] : [];
  const canGoBack = levelIndex > 0;

  const ask = (item) => {
    if (replying) return;
    setReplying(true);
    const next = Array.isArray(item.children) ? item.children : [];
    const stamp = `${item.id}-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: `u-${stamp}`, role: "user", text: item.question },
      { id: `t-${stamp}`, role: "typing" },
    ]);

    const timer = window.setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) =>
          message.id === `t-${stamp}`
            ? { id: `b-${stamp}`, role: "bot", text: item.answer }
            : message
        )
      );
      setLevels((prev) => {
        const base = prev?.length ? prev : [questions];
        return [...base.slice(0, levelIndex + 1), next];
      });
      setLevelIndex((index) => index + 1);
      setReplying(false);
    }, 420);
    timers.current.push(timer);
  };

  const goBack = () => {
    if (replying || !canGoBack) return;
    setLevelIndex((index) => Math.max(0, index - 1));
  };

  return (
    <div className="dp-bot">
      {open && (
        <section className="dp-bot-panel" role="dialog" aria-label="Dr.Prime assistant">
          <header className="dp-bot-head">
            <div className="dp-bot-head-copy">
              <span className="dp-bot-kicker">Dr.Prime</span>
              <strong>Assistant</strong>
            </div>
            <button
              type="button"
              className="dp-bot-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </header>

          <div className="dp-bot-messages" ref={listRef}>
            <div className="dp-bot-row is-bot">
              <span className="dp-bot-avatar" aria-hidden="true">
                <i className="fa-solid fa-comment-dots" />
              </span>
              <p className="dp-bot-bubble">Hi! How can I help you today?</p>
            </div>

            {messages.map((message) =>
              message.role === "typing" ? (
                <div className="dp-bot-row is-bot" key={message.id}>
                  <span className="dp-bot-avatar" aria-hidden="true">
                    <i className="fa-solid fa-comment-dots" />
                  </span>
                  <p className="dp-bot-bubble dp-bot-typing" aria-label="Assistant is replying">
                    <span />
                    <span />
                    <span />
                  </p>
                </div>
              ) : (
                <div
                  className={`dp-bot-row${message.role === "user" ? " is-user" : " is-bot"}`}
                  key={message.id}
                >
                  {message.role === "bot" && (
                    <span className="dp-bot-avatar" aria-hidden="true">
                      <i className="fa-solid fa-comment-dots" />
                    </span>
                  )}
                  <p className="dp-bot-bubble">{message.text}</p>
                </div>
              )
            )}

            {isLoading && <p className="dp-bot-status">One moment…</p>}
            {isError && (
              <div className="dp-bot-status">
                <p>I could not load replies just now.</p>
                <button type="button" onClick={() => refetch()} disabled={isFetching}>
                  Try again
                </button>
              </div>
            )}
          </div>

          {!isLoading && !isError && currentList.length > 0 && (
            <div className="dp-bot-follow">
              {canGoBack && (
                <button type="button" className="dp-bot-back" onClick={goBack}>
                  <i className="fa-solid fa-arrow-left" />
                  Other questions
                </button>
              )}
              <div className="dp-bot-chips" role="list" aria-label="Suggested questions">
                {currentList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="listitem"
                    className="dp-bot-chip"
                    onClick={() => ask(item)}
                    disabled={replying}
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !isError && canGoBack && currentList.length === 0 && (
            <div className="dp-bot-follow dp-bot-leaf">
              <p>Anything else I can help with?</p>
              <button type="button" onClick={goBack}>
                More questions
              </button>
            </div>
          )}
        </section>
      )}

      <button
        type="button"
        className="dp-bot-launcher"
        aria-expanded={open}
        aria-label={open ? "Close assistant" : "Open assistant"}
        onClick={() => setOpen((value) => !value)}
      >
        <i className={`fa-solid ${open ? "fa-xmark" : "fa-comment-dots"}`} />
      </button>
    </div>
  );
}
