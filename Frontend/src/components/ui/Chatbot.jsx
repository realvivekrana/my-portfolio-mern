import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
  HiOutlineUser,
} from 'react-icons/hi2';
import { FaRobot } from 'react-icons/fa6';
import { FaSpinner } from 'react-icons/fa';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| AI CHATBOT WIDGET (MOBILE-FIRST RESPONSIVE)
|--------------------------------------------------------------------------
|
| Floating chat button jo portfolio ke har page (public) par bottom-right
| corner me dikhta hai. Click karne par ek chat window khulti hai jaha
| visitor Vivek ke portfolio (skills, projects, experience, education,
| contact) ke baare me sawal pooch sakta hai.
|
| RESPONSIVE STRATEGY (mobile-first):
|   - Base (no prefix) styles target the smallest phones first.
|   - no-prefix (<640px) -> full-width bottom sheet, safe-area aware,
|                        dvh units so the iOS/Android URL bar never
|                        clips the window, 16px input font so iOS
|                        Safari does not auto-zoom on focus.
|   - `sm:` (>=640px)  -> switches to a floating card, docked above
|                        the toggle button, fixed width/height.
|   - `md:`             -> slightly wider floating card.
|   - A tap-outside backdrop is shown only on mobile (`sm:hidden`) so
|     the sheet behaves like a native bottom sheet; on desktop the
|     card floats without dimming the page.
|   - Body scroll is locked while the sheet is open on small screens
|     so the page behind it doesn't scroll along with the chat.
|
| Backend flow:
|
| Chatbot.jsx
|     ↓
| POST /api/chatbot  { message, history }
|     ↓
| chatbotController.js (portfolio context + AI provider)
|     ↓
| AI response
|     ↓
| Chat window
|
|--------------------------------------------------------------------------
*/

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: 'model',
      text:
        "Hi! 👋 I'm Vivek's portfolio assistant. Ask me anything about his skills, projects, experience or education!",
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

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
  |
  | Sirf small screens (< 640px, Tailwind's `sm` breakpoint) par body
  | scroll lock karte hain, kyunki wahan chat window ek full-width
  | bottom sheet ki tarah dikhti hai. Desktop/tablet par ye sirf ek
  | floating card hai, isliye background page normally scroll hona
  | chahiye.
  |
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
      // Small delay lets the open transition finish before focusing,
      // which avoids the mobile keyboard fighting the layout shift.
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /*
  |--------------------------------------------------------------------------
  | SEND MESSAGE
  |--------------------------------------------------------------------------
  */

  const handleSend = async (e) => {
    e?.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || isLoading) return;

    const updatedMessages = [
      ...messages,
      { role: 'user', text: trimmed },
    ];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await API.post('/chatbot', {
        message: trimmed,
        history: updatedMessages.slice(-10),
      });

      const reply =
        response.data?.data?.reply ||
        "Sorry, I couldn't understand that. Please try again.";

      setMessages((prev) => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error('Chatbot error:', error);

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text:
            error.response?.data?.message ||
            "Oops! Something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* =====================================================
          MOBILE-ONLY BACKDROP
          -----------------------------------------------------
          Tap-outside-to-close, native bottom-sheet feel.
          Hidden from `sm` breakpoint up, since desktop shows a
          floating card instead of a full sheet.
      ====================================================== */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
          className="
            fixed inset-0 z-[59]
            bg-black/40 backdrop-blur-[2px]
            sm:hidden
          "
        />
      )}

      {/* =====================================================
          FLOATING TOGGLE BUTTON
          -----------------------------------------------------
          Sized down slightly on the smallest phones, safe-area
          aware so it never sits under a device's home indicator
          / gesture bar.
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
          -----------------------------------------------------
          Mobile (base styles)  -> full-width bottom sheet using
          `dvh` so the dynamic mobile browser chrome never clips
          it, with safe-area padding at the bottom.

          `sm:` and up          -> floating card docked above the
          toggle button, fixed width/height, rounded on all sides.
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
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-white/20
                "
              >
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

            {/* Explicit close button — always reachable, even if the
                floating toggle button ends up hidden behind the sheet
                on very small screens. */}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-full
                text-white/90
                transition-colors
                hover:bg-white/15
                active:bg-white/25
              "
            >
              <HiOutlineXMark size={18} />
            </button>
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

                <div
                  className={`
                    max-w-[82%] break-words rounded-2xl px-3 py-2 text-sm leading-relaxed
                    sm:max-w-[75%]
                    ${
                      msg.role === 'user'
                        ? 'rounded-tr-sm bg-indigo-600 text-white'
                        : 'rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <FaSpinner size={14} className="animate-spin" />
                <span className="text-xs">Thinking...</span>
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
