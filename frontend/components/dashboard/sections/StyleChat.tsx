'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, User, Send } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface StyleChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
}

export default function StyleChat({
  messages,
  onSendMessage,
  inputValue,
  onInputChange
}: StyleChatProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col min-h-[500px] sm:min-h-[600px] max-h-[80vh]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'ai' && (
              <div className="w-8 h-8 bg-[#0095da] rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-[#0095da] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-700" />
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask me about styling, outfits, or fashion advice..."
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none text-sm sm:text-base text-gray-900 transition-all"
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-[#0095da] hover:bg-[#007ab8] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          AI-powered style assistant • Get personalized fashion advice
        </p>
      </div>
    </div>
  );
}

