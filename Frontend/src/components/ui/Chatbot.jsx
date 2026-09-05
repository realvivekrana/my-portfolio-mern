import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineUser,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineArrowDownTray,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { FaRobot, FaGithub } from 'react-icons/fa6';

import { API_BASE_URL } from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| AI CHATBOT WIDGET (MOBILE-FIRST, STREAMING, TOOL-AWARE)
|--------------------------------------------------------------------------
|
| Floating chat button jo portfolio ke har page (public) par bottom-right
| corner me dikhta hai. Click karne par ek chat window khulti hai jaha
| visitor Vivek ke portfolio (skills, projects, experience, education,
| contact) ke baare me sawal pooch sakta hai.
|
| FEATURES:
|   1. Streaming replies  — tokens ChatGPT-style type hote hue aate hain,
|      backend se Server-Sent Events (SSE) ke through.
|   2. Quick-reply chips  — pehli baar chat khulne par kuch suggested
|      sawal dikhte hain, taaki visitor ko pata chale kya pooch sakta hai.
|   3. "Function calling" actions — jab visitor resume maange ya kisi
|      specific project ka link maange, backend AI model se ek "tool"
|      call karwata hai jo real DB se link nikal kar UI ko `action`
|      event ke through bhejta hai; hum usko ek asli button/link ki
|      tarah render karte hain (raw text me URL nahi).
|   4. Chat history persistence — localStorage me save hoti hai, taaki
|      page refresh par conversation na ude.
|   5. Server-side rate limiting (chatbotRoutes.js) — spam/quota abuse
|      se bachne ke liye; agar limit lag jaaye toh ek friendly error
|      message dikhta hai.
|
| RESPONSIVE STRATEGY (mobile-first) — unchanged from before:
|   - Base (<640px)  -> full-width bottom sheet using `dvh` units, safe
|                        area aware, tap-outside-to-close, 16px input
|                        font (no iOS zoom-on-focus).
|   - `sm:` (>=640px) -> floating card docked above the toggle button.
|   - `md:`            -> slightly wider floating card.
|
| Backend flow:
|
| Chatbot.jsx
|     ↓  fetch() (not axios — axios can't stream in the browser)
| POST /api/chatbot  { message, history }
|     ↓
| chatbotController.js (portfolio context + Groq API, tool calling)
|     ↓  Server-Sent Events
| event: chunk  -> { token }     streamed reply text
| event: action -> { type, ... } resume/project link to render
| event: error  -> { message }
| event: done   -> {}
|     ↓
| Chat window (typewriter effect + action buttons)
|
|--------------------------------------------------------------------------
*/

const CHAT_HISTORY_KEY = 'portfolio_chatbot_history_v1';

const MAX_STORED_MESSAGES = 40;

const DEFAULT_GREETING = {
  role: 'model',
  text:
    "Hi! 👋 I'm Vivek's portfolio assistant. Ask me anything about his skills, projects, experience or education!",
};

const QUICK_REPLIES = [
  'What are his skills?',
  'Show me his projects',
  'Download his resume',
  'Tell me about his experience',
];

/*
|--------------------------------------------------------------------------
| Helper: Load / Save Chat History (localStorage)
|--------------------------------------------------------------------------
*/

const loadStoredMessages = () => {
  if (typeof window === 'undefined') return [DEFAULT_GREETING];

  try {
    const raw = window.localStorage.getItem(CHAT_HISTORY_KEY);

    if (!raw) return [DEFAULT_GREETING];

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed) && parsed.length > 0) {
      // Never resume mid-stream — if the tab was closed while a reply
      // was still streaming, treat whatever text arrived as final.
      return parsed.map((msg) => ({ ...msg, streaming: false }));
    }

    return [DEFAULT_GREETING];
  } catch (error) {
    return [DEFAULT_GREETING];
  }
};

/*
|--------------------------------------------------------------------------
| Helper: Parse one SSE "event" block into { event, data }
|--------------------------------------------------------------------------
*/

const parseSseBlock = (block) => {
  let eventName = 'message';
  const dataLines = [];

  for (const rawLine of block.split('\n')) {
    if (rawLine.startsWith('event:')) {
      eventName = rawLine.slice('event:'.length).trim();
    } else if (rawLine.startsWith('data:')) {
      dataLines.push(rawLine.slice('data:'.length).trim());
    }
  }

  if (dataLines.length === 0) return null;

  try {
    return { event: eventName, data: JSON.parse(dataLines.join('\n')) };
  } catch (error) {
    return null;
  }
};

/*
|--------------------------------------------------------------------------
| Small presentational bits
|--------------------------------------------------------------------------
*/

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s] dark:bg-gray-500" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s] dark:bg-gray-500" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" />
    </span>
  );
}

function ActionCard({ action }) {
  if (!action) return null;

  if (action.type === 'resume') {
    return (
      <a
        href={`${API_BASE_URL}${action.path}`}
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-2 inline-flex items-center gap-2
          rounded-xl border border-indigo-200 bg-indigo-50
          px-3 py-2 text-xs font-medium text-indigo-700
          transition-colors hover:bg-indigo-100
          dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300
          dark:hover:bg-indigo-500/20
        "
      >
        <HiOutlineArrowDownTray size={15} />
        {action.label || 'Download Resume'}
      </a>
    );
  }

  if (action.type === 'project') {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {action.liveLink && (
          <a
            href={action.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1.5
              rounded-xl border border-indigo-200 bg-indigo-50
              px-3 py-2 text-xs font-medium text-indigo-700
              transition-colors hover:bg-indigo-100
              dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300
              dark:hover:bg-indigo-500/20
            "
          >
            <HiOutlineArrowTopRightOnSquare size={14} />
            Live Demo
          </a>
        )}

        {action.githubLink && (
          <a
            href={action.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-1.5
              rounded-xl border border-gray-200 bg-gray-50
              px-3 py-2 text-xs font-medium text-gray-700
              transition-colors hover:bg-gray-100
              dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200
              dark:hover:bg-gray-700
            "
          >
            <FaGithub size={13} />
            GitHub
          </a>
        )}
      </div>
    );
  }

  return null;
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState(loadStoredMessages);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | PERSIST CHAT HISTORY TO LOCALSTORAGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    try {
      const trimmed = messages.slice(-MAX_STORED_MESSAGES);
      window.localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      // localStorage unavailable (private mode, quota, etc.) — non-fatal
    }
  }, [messages]);

  /*
  |--------------------------------------------------------------------------
  | AUTO SCROLL TO LATEST MESSAGE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isLoading]);

  /*
  |--------------------------------------------------------------------------
  | LOCK BODY SCROLL ON MOBILE WHILE THE SHEET IS OPEN
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const shouldLockScroll = isOpen && mobileQuery.matches;
    const previousOverflow = document.body.style.overflow;

    if (shouldLockScroll) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /*
  |--------------------------------------------------------------------------
  | AUTOFOCUS INPUT WHEN CHAT OPENS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /*
  |--------------------------------------------------------------------------
  | CANCEL ANY IN-FLIGHT STREAM ON UNMOUNT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SEND MESSAGE (STREAMING)
  |--------------------------------------------------------------------------
  */

  const handleSend = async (e, overrideText) => {
    e?.preventDefault();

    const trimmed = (overrideText ?? input).trim();

    if (!trimmed || isLoading) return;

    const updatedMessages = [...messages, { role: 'user', text: trimmed }];

    // Snapshot of history to send to the backend, BEFORE we add the
    // empty streaming placeholder below.
    const historyForRequest = updatedMessages.slice(-10);

    setMessages([...updatedMessages, { role: 'model', text: '', streaming: true }]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyForRequest,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData?.message ||
            (response.status === 429
              ? "You're sending messages a little too quickly. Please wait a few minutes and try again."
              : 'Chatbot service is unavailable right now.')
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let buffer = '';
      let receivedAnyToken = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE events are separated by a blank line ("\n\n")
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() ?? '';

        for (const block of blocks) {
          const parsed = parseSseBlock(block);
          if (!parsed) continue;

          const { event, data } = parsed;

          if (event === 'chunk' && data?.token) {
            receivedAnyToken = true;

            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = {
                ...last,
                text: (last.text || '') + data.token,
              };
              return next;
            });
          } else if (event === 'action' && data?.type) {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, action: data };
              return next;
            });
          } else if (event === 'error') {
            throw new Error(
              data?.message || 'Something went wrong. Please try again.'
            );
          }
        }
      }

      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = {
          ...last,
          streaming: false,
          text: receivedAnyToken
            ? last.text
            : "Sorry, I couldn't generate a response right now. Please try again.",
        };
        return next;
      });
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error('Chatbot error:', error);

      const errorText =
        error.message || 'Oops! Something went wrong. Please try again in a moment.';

      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];

        if (last?.role === 'model' && last.streaming) {
          next[next.length - 1] = { role: 'model', text: errorText };
        } else {
          next.push({ role: 'model', text: errorText });
        }

        return next;
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | QUICK REPLY CHIP CLICK
  |--------------------------------------------------------------------------
  */

  const handleQuickReply = (text) => {
    handleSend(undefined, text);
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR CHAT HISTORY
  |--------------------------------------------------------------------------
  */

  const handleClearChat = () => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    setMessages([DEFAULT_GREETING]);

    try {
      window.localStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      // non-fatal
    }
  };

  const showQuickReplies =
    messages.length === 1 && messages[0]?.text === DEFAULT_GREETING.text && !isLoading;

  return (
    <>
      {/* =====================================================
          MOBILE-ONLY BACKDROP
      ====================================================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-[59] bg-black/40 backdrop-blur-[2px] sm:hidden"
        />
      )}

      {/* =====================================================
          FLOATING TOGGLE BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close AI chatbot' : 'Open AI chatbot'}
        aria-expanded={isOpen}
        className="
          fixed z-[60]
          right-4
          bottom-[calc(1rem+env(safe-area-inset-bottom))]
          flex h-12 w-12
          items-center justify-center
          rounded-full
          bg-indigo-600
          text-white
          shadow-lg shadow-indigo-600/30
          transition-transform duration-300
          hover:scale-110
          hover:bg-indigo-500
          active:scale-95
          dark:bg-indigo-500
          dark:hover:bg-indigo-400

          sm:right-6
          sm:bottom-6
          sm:h-14
          sm:w-14
        "
      >
        {isOpen ? (
          <HiOutlineXMark size={22} className="sm:hidden" />
        ) : (
          <HiOutlineChatBubbleLeftRight size={22} className="sm:hidden" />
        )}

        {isOpen ? (
          <HiOutlineXMark size={24} className="hidden sm:block" />
        ) : (
          <HiOutlineChatBubbleLeftRight size={24} className="hidden sm:block" />
        )}
      </button>

      {/* =====================================================
          CHAT WINDOW
      ====================================================== */}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio AI chatbot"
          className="
            fixed inset-x-0 bottom-0 z-[60]
            flex h-[88dvh] max-h-[640px] w-full
            flex-col overflow-hidden
            rounded-t-3xl
            border border-b-0 border-gray-200
            bg-white
            shadow-2xl
            dark:border-gray-800 dark:bg-gray-900

            sm:inset-x-auto sm:bottom-24 sm:right-6
            sm:h-[70vh] sm:max-h-[600px] sm:w-[380px]
            sm:rounded-2xl sm:border-b

            md:right-6 md:w-[400px]
          "
        >
          {/* Header */}

          <div
            className="
              flex shrink-0 items-center justify-between
              gap-3
              border-b border-gray-100
              bg-indigo-600
              px-4 py-3
              text-white
              dark:border-gray-800
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <FaRobot size={16} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Portfolio Assistant
                </p>
                <p className="truncate text-xs text-white/80">
                  Ask me anything 👋
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                aria-label="Clear chat history"
                title="Clear chat"
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-full text-white/90
                  transition-colors
                  hover:bg-white/15
                  active:bg-white/25
                "
              >
                <HiOutlineTrash size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-full text-white/90
                  transition-colors
                  hover:bg-white/15
                  active:bg-white/25
                "
              >
                <HiOutlineXMark size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}

          <div
            ref={scrollRef}
            className="
              flex-1
              space-y-3
              overflow-y-auto overscroll-contain
              px-3 py-4
              sm:px-4
            "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  msg.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`
                    flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                    ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-400'
                    }
                  `}
                >
                  {msg.role === 'user' ? (
                    <HiOutlineUser size={14} />
                  ) : (
                    <FaRobot size={13} />
                  )}
                </div>

                <div className="flex max-w-[82%] flex-col sm:max-w-[75%]">
                  <div
                    className={`
                      break-words rounded-2xl px-3 py-2 text-sm leading-relaxed
                      ${
                        msg.role === 'user'
                          ? 'rounded-tr-sm bg-indigo-600 text-white'
                          : 'rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }
                    `}
                  >
                    {msg.text ? (
                      <>
                        {msg.text}
                        {msg.streaming && (
                          <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-current align-middle" />
                        )}
                      </>
                    ) : msg.streaming ? (
                      <TypingDots />
                    ) : null}
                  </div>

                  {msg.role === 'model' && <ActionCard action={msg.action} />}
                </div>
              </div>
            ))}

            {/* Quick reply chips — only shown before the first user message */}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pl-9">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    className="
                      rounded-full border border-indigo-200 bg-indigo-50
                      px-3 py-1.5 text-xs font-medium text-indigo-700
                      transition-colors
                      hover:bg-indigo-100
                      dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300
                      dark:hover:bg-indigo-500/20
                    "
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}

          <form
            onSubmit={handleSend}
            className="
              flex shrink-0
              items-center gap-2
              border-t border-gray-100
              p-3
              pb-[calc(0.75rem+env(safe-area-inset-bottom))]
              dark:border-gray-800
              sm:pb-3
            "
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              autoComplete="off"
              className="
                min-w-0 flex-1
                rounded-full
                border border-gray-200
                bg-gray-50
                px-4 py-2.5
                text-base
                text-gray-800
                outline-none
                focus:border-indigo-500
                disabled:opacity-60
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-100

                sm:py-2 sm:text-sm
              "
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                bg-indigo-600
                text-white
                transition-colors
                hover:bg-indigo-500
                disabled:cursor-not-allowed
                disabled:opacity-50

                sm:h-9 sm:w-9
              "
            >
              <HiOutlinePaperAirplane size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
