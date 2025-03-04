
import React from 'react';
import { AssistantState } from '@/lib/assistant';

interface CommandHistoryProps {
  history: AssistantState['history'];
  onSelectHistoryItem: (query: string) => void;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ 
  history, 
  onSelectHistoryItem 
}) => {
  if (history.length === 0) {
    return (
      <div className="glass-panel p-4 rounded-xl text-center text-sm text-muted-foreground">
        <p>No previous commands</p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <h3 className="font-medium px-4 pt-4 pb-2">Previous Commands</h3>
      <div className="divide-y divide-border/30">
        {history.slice().reverse().map((item, index) => (
          <button
            key={index}
            onClick={() => onSelectHistoryItem(item.query)}
            className="w-full px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <p className="text-sm font-medium truncate">{item.query}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {item.timestamp.toLocaleTimeString(undefined, { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CommandHistory;
