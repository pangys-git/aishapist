import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Send, User, Bot, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

interface AIShapistChatProps {
  onBack: () => void;
  initialMessage?: string;
  onUpdateContext?: (context: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const AIShapistChat: React.FC<AIShapistChatProps> = ({ onBack, initialMessage, onUpdateContext }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialMessage || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);
  const initialSentRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const initChat = async () => {
      if (chatRef.current) return;
      
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("API Key is missing. Please configure GEMINI_API_KEY in settings.");
        }
        const ai = new GoogleGenAI({ apiKey });
        
        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: `你是一位「肌不可失」AI 專家，結合了健身導師、物理治療師和營養師的專業知識，專門協助長者預防肌肉流失（肌少症）。

你的任務是與用戶對談，提供專業建議。在提供運動建議時，請務必包含以下三個核心維度：

1. **運動前準備與安全提醒**：
   - 提醒用戶檢查環境安全（防滑、空間充足）。
   - 穿著合適的運動鞋服。
   - 運動前的熱身建議（如原地踏步 5 分鐘）。
   - 提醒運動中若感到頭暈、胸痛或劇烈疼痛應立即停止。

2. **每週訓練計劃建議**：
   - 為長者設計平衡的每週計劃（例如：每週 3 次阻力訓練，2 次平衡或伸展練習）。
   - 強調「循序漸進」與「規律性」。

3. **動作教學與進階建議**：
   - 提供清晰的動作步驟說明。
   - 針對不同程度提供調整建議：
     - **入門級**：使用椅子支撐、減少次數。
     - **進階級**：增加阻力（如手持水瓶）、增加保持時間或次數。

如果用戶描述的情況嚴重（例如劇烈疼痛、受傷、嚴重無力），請強烈建議用戶尋求專業醫療協助及就醫。

請以繁體中文（zh-TW）回覆，語氣專業、友善、有耐心且具同理心。`,
          },
        });

        // Add initial greeting if no messages
        setMessages(prev => prev.length === 0 ? [
          {
            id: 'greeting',
            role: 'model',
            text: '您好！我是您的「肌不可失」AI 專家。我會協助您透過運動與飲食來預防肌肉流失，保持身體強健。無論是想了解適合長者的運動建議，還是有營養方面的疑問，我都在這裡為您解答。請問今天想聊些什麼呢？'
          }
        ] : prev);

        if (initialMessage && !initialSentRef.current) {
          initialSentRef.current = true;
          handleSendMessage(initialMessage);
        }
      } catch (error: any) {
        console.error("Failed to initialize chat:", error);
        setMessages([
          {
            id: 'error-init',
            role: 'model',
            text: `初始化失敗：${error.message || '未知錯誤'}。請檢查 API 金鑰設定。`
          }
        ]);
      }
    };

    initChat();
  }, [initialMessage]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    };

    const modelMsgId = (Date.now() + 1).toString();
    const modelMsg: Message = {
      id: modelMsgId,
      role: 'model',
      text: '',
    };

    setMessages(prev => [...prev, userMsg, modelMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: text });
      
      let fullText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => prev.map(m => 
            m.id === modelMsgId ? { ...m, text: fullText } : m
          ));
        }
      }

      if (!fullText) {
        setMessages(prev => prev.map(m => 
          m.id === modelMsgId ? { ...m, text: '抱歉，我現在無法回答。' } : m
        ));
      } else {
        // Update context with the latest advice
        onUpdateContext?.(fullText);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = '抱歉，發生了一些錯誤，請稍後再試。';
      if (error.message?.includes('API_KEY_INVALID')) {
        errorMessage = 'API 金鑰無效，請檢查設定。';
      } else if (error.message?.includes('quota')) {
        errorMessage = '已達到 API 使用限額，請稍後再試。';
      }
      
      setMessages(prev => prev.map(m => 
        m.id === modelMsgId ? { ...m, text: errorMessage } : m
      ));
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
