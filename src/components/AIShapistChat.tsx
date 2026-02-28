import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, User, Bot, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

interface AIShapistChatProps {
  onBack: () => void;
  initialMessage?: string;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIShapistChat: React.FC<AIShapistChatProps> = ({ onBack, initialMessage }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const initChat = async () => {
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
        
        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: "你是一位「AI形養師」，結合了健身導師、物理治療師和營養師的專業知識。你的任務是與用戶對談，建議他們有什麼運動、飲食有助改善身形。如果用戶描述的情況嚴重（例如劇烈疼痛、受傷），請強烈建議用戶尋求專業醫療協助及就醫。請以繁體中文（zh-TW）回覆，語氣專業、友善且具同理心。",
          },
        });

        // Add initial greeting
        setMessages([
          {
            id: 'greeting',
            role: 'model',
            text: '你好！我是你的專屬 AI 形養師。無論是想改善體態、尋求運動建議，還是有飲食上的疑問，我都在這裡為你解答。請問今天想聊些什麼呢？'
          }
        ]);

        if (initialMessage) {
          handleSendMessage(initialMessage);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initChat();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: text });
      
      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || '抱歉，我現在無法回答。',
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: '抱歉，發生了一些錯誤，請稍後再試。',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="p-2 mr-4 rounded-full hover:bg-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-zinc-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">{(t as any).aiShapistChat.title}</h2>
          <p className="text-sm text-zinc-500">{(t as any).aiShapistChat.desc}</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-indigo-100 ml-3' : 'bg-emerald-100 mr-3'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-zinc-100 text-zinc-900 rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="markdown-body text-sm leading-relaxed space-y-2">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[80%] flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 mr-3 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-100 text-zinc-900 rounded-tl-none flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <span className="text-sm text-zinc-500">正在思考...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-zinc-100">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="輸入你的問題..."
              className="flex-1 px-4 py-3 bg-zinc-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
