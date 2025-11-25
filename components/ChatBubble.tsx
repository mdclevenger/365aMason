import React from 'react';
import { Message, Sender } from '../types';
import { User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Sender.USER;

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-masonic-gold/30 ${isUser ? 'bg-masonic-blue' : 'bg-masonic-gold'}`}>
          {isUser ? (
            <User className="w-6 h-6 text-masonic-light" />
          ) : (
            <Sparkles className="w-6 h-6 text-masonic-dark" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`
            px-6 py-4 rounded-2xl shadow-lg text-sm md:text-base leading-relaxed
            ${isUser 
              ? 'bg-masonic-blue text-masonic-light rounded-tr-none' 
              : 'bg-masonic-parchment text-slate-900 rounded-tl-none border border-masonic-gold/20'}
          `}>
            
            {/* Image Display */}
            {message.image && (
              <div className="mb-4 rounded-lg overflow-hidden border-2 border-masonic-gold/50 shadow-md">
                <img src={message.image} alt="Uploaded symbol" className="max-w-full h-auto max-h-64 object-cover" />
              </div>
            )}

            {/* Text Display */}
            <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown 
                 components={{
                    p: ({node, ...props}) => <p className={isUser ? "text-slate-100" : "text-slate-800"} {...props} />,
                    strong: ({node, ...props}) => <strong className={isUser ? "text-white font-bold" : "text-masonic-blue font-bold"} {...props} />,
                    li: ({node, ...props}) => <li className={isUser ? "text-slate-100" : "text-slate-800"} {...props} />,
                 }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
          
          <span className="text-xs text-slate-500 mt-1 px-1">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};