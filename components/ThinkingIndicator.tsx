import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex w-full mb-6 justify-start animate-pulse">
      <div className="flex max-w-[75%] flex-row gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-masonic-gold/30 bg-masonic-gold/50">
          <BrainCircuit className="w-6 h-6 text-masonic-dark animate-spin-slow" />
        </div>
        <div className="flex items-center">
          <div className="bg-slate-800/50 px-4 py-2 rounded-full border border-masonic-gold/20 flex items-center gap-2">
            <span className="text-masonic-gold text-sm font-serif italic">Contemplating the deeper meaning...</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-masonic-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-masonic-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-masonic-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};