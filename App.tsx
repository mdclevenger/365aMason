import React, { useState, useRef, useEffect } from 'react';
import { ChatBubble } from './components/ChatBubble';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { ImageUpload } from './components/ImageUpload';
import { sendMessageToGemini } from './services/geminiService';
import { Message, Sender } from './types';
import { Send, BookOpen, DraftingCompass, Gavel, Eye } from 'lucide-react';

const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: Sender.MODEL,
  text: "Greetings, seeker of Masonic light. I am here to assist you in exploring the hidden wisdom of our Craft. Share a symbol with me, or ask a question, and let us reflect together on how these ancient tools may help you build a better life today.",
  timestamp: Date.now()
};

const SUGGESTIONS = [
  {
    id: 'sq_comp',
    icon: <DraftingCompass className="w-6 h-6 text-masonic-gold" />,
    title: "Square & Compasses",
    subtitle: "Virtue & Boundaries",
    prompt: "What is the allegorical meaning of the Square and Compasses?"
  },
  {
    id: 'gavel',
    icon: <Gavel className="w-6 h-6 text-masonic-gold" />,
    title: "The Common Gavel",
    subtitle: "Divesting Vices",
    prompt: "How should a Mason apply the lesson of the Common Gavel in daily life?"
  },
  {
    id: 'eye',
    icon: <Eye className="w-6 h-6 text-masonic-gold" />,
    title: "All-Seeing Eye",
    subtitle: "Omniscience & Duty",
    prompt: "Explain the symbolism of the All-Seeing Eye and its relation to conscience."
  }
];

function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;

    if ((!textToSend.trim() && !selectedImage) || isThinking) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: Sender.USER,
      text: textToSend,
      image: selectedImage || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsThinking(true);

    try {
      const responseText = await sendMessageToGemini(
        messages, 
        newUserMessage.text || "Please analyze this symbol.", // Fallback text if only image is sent
        newUserMessage.image
      );

      const newModelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Sender.MODEL,
        text: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, newModelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: Sender.MODEL,
        text: "I apologize, but the clouds of uncertainty obscure my vision at this moment. Please try asking again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-serif bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-masonic-gold/30 shadow-xl z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-masonic-gold/10 p-2 rounded-full border border-masonic-gold/40">
              <DraftingCompass className="w-8 h-8 text-masonic-gold" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-heading text-masonic-gold tracking-wider">Masonic Mentor</h1>
              <p className="text-xs text-slate-400 font-serif italic">Wisdom • Strength • Beauty</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-masonic-gold/60 border border-masonic-gold/20 px-3 py-1 rounded-full">
            <BookOpen size={14} />
            <span>Socratic Mode Active</span>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-2">
          {messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          
          {/* Suggestions Section - Only show when just the initial message exists */}
          {messages.length === 1 && !isThinking && (
            <div className="w-full fade-in-up animate-[fadeIn_0.5s_ease-out]">
              <p className="text-center text-slate-500 text-sm italic mb-4 font-serif">Explore common symbols...</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-8">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSendMessage(suggestion.prompt)}
                    className="flex flex-col items-center p-4 bg-slate-900/50 border border-masonic-gold/20 rounded-xl hover:bg-slate-800 hover:border-masonic-gold/50 transition-all duration-300 group text-center shadow-lg"
                  >
                    <div className="mb-3 p-3 rounded-full bg-slate-950 border border-masonic-gold/10 group-hover:border-masonic-gold/40 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all">
                      {suggestion.icon}
                    </div>
                    <h3 className="text-masonic-gold font-heading text-sm mb-1 tracking-wide">{suggestion.title}</h3>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 font-serif">{suggestion.subtitle}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isThinking && <ThinkingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-slate-900 border-t border-masonic-gold/30 p-4 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-2xl p-2 flex items-end gap-2 shadow-inner border border-slate-700 focus-within:border-masonic-gold/50 transition-colors">
            
            <div className="flex-shrink-0 mb-1 ml-1">
              <ImageUpload selectedImage={selectedImage} onImageSelect={setSelectedImage} />
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question about Freemasonry or upload a symbol"
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 resize-none focus:outline-none py-3 px-2 max-h-32 min-h-[3rem]"
              rows={1}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={(!inputText.trim() && !selectedImage) || isThinking}
              className={`
                mb-1 mr-1 p-3 rounded-xl transition-all duration-200
                ${(!inputText.trim() && !selectedImage) || isThinking
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-masonic-gold text-slate-900 hover:bg-yellow-500 shadow-lg hover:shadow-yellow-500/20'}
              `}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-2 font-sans">
            AI may generate inaccurate information about people, places, or facts.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;