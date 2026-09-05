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
| AI CHATBOT WIDGET
|--------------------------------------------------------------------------
|
| Floating chat button jo portfolio ke har page (public) par bottom-right
| corner me dikhta hai. Click karne par ek chat window khulti hai jaha
| visitor Vivek ke portfolio (skills, projects, experience, education,
| contact) ke baare me sawal pooch sakta hai.
|
| Backend flow:
|
| Chatbot.jsx
|     ↓
| POST /api/chatbot  { message, history }
|     ↓
| chatbotController.js (portfolio context + Gemini API)
|     ↓
| Gemini response
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
          FLOATING TOGGLE BUTTON
      ====================================================== */}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle AI chatbot"
        className="
          fixed
          bottom-6
          right-6
          z-[60]
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-indigo-600
          text-white
          shadow-lg
          shadow-indigo-600/30
          transition-transform
          duration-300
          hover:scale-110
          hover:bg-indigo-500
          dark:bg-indigo-500
          dark:hover:bg-indigo-400
        "
      >
        {isOpen ? (
          <HiOutlineXMark size={24} />
        ) : (
          <HiOutlineChatBubbleLeftRight size={24} />
        )}
      </button>

      {/* =====================================================
          CHAT WINDOW
      ====================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-[60]
            flex
            h-[70vh]
            max-h-[520px]
            w-[90vw]
            max-w-sm
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            dark:border-gray-800
            dark:bg-gray-900
          "
        >
          {/* Header */}

          <div
            className="
              flex
              items-center
              gap-3
              border-b
              border-gray-100
              bg-indigo-600
              px-4
              py-3
              text-white
              dark:border-gray-800
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/20
              "
            >
              <FaRobot size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold">Portfolio Assistant</p>
              <p className="text-xs text-white/80">Ask me anything 👋</p>
            </div>
          </div>

          {/* Messages */}

          <div
            ref={scrollRef}
            className="
              flex-1
              space-y-3
              overflow-y-auto
              px-4
              py-4
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
                    max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed
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
              flex
              items-center
              gap-2
              border-t
              border-gray-100
              p-3
              dark:border-gray-800
            "
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isLoading}
              className="
                flex-1
                rounded-full
                border
                border-gray-200
                bg-gray-50
                px-4
                py-2
                text-sm
                text-gray-800
                outline-none
                focus:border-indigo-500
                disabled:opacity-60
                dark:border-gray-700
                dark:bg-gray-800
                dark:text-gray-100
              "
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-indigo-600
                text-white
                transition-colors
                hover:bg-indigo-500
                disabled:cursor-not-allowed
                disabled:opacity-50
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