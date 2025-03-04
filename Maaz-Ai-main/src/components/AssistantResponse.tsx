
import React, { useEffect, useState, useRef } from 'react';

interface AssistantResponseProps {
  text: string;
  isGenerating: boolean;
}

export const AssistantResponse: React.FC<AssistantResponseProps> = ({ text, isGenerating }) => {
  const [displayText, setDisplayText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset typing effect when text changes
  useEffect(() => {
    if (text !== displayText) {
      setCharIndex(0);
      setDisplayText('');
    }
  }, [text]);

  // Text typing effect
  useEffect(() => {
    if (charIndex < text.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayText(prev => prev + text.charAt(charIndex));
        setCharIndex(prevIndex => prevIndex + 1);
      }, 15); // Speed of typing

      return () => clearTimeout(typingTimeout);
    }
  }, [charIndex, text]);

  // Auto-scroll to bottom as text is typed
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText]);

  // Formats code blocks with syntax highlighting
  const formatText = (text: string) => {
    if (!text) return null;

    // Split by code blocks
    const parts = text.split(/```(\w*)\n([\s\S]*?)```/g);
    
    return parts.map((part, index) => {
      // Every 3 parts form a group: before code, language, code
      if (index % 3 === 0) {
        // Regular text - handle line breaks
        return part.split('\n').map((line, i) => (
          <React.Fragment key={`line-${index}-${i}`}>
            {line}
            {i < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      } else if (index % 3 === 1) {
        // This is the language specifier, we skip rendering this directly
        return null;
      } else {
        // Code block
        const language = parts[index - 1] || 'text';
        return (
          <pre key={`code-${index}`} className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 my-2 overflow-x-auto">
            <code className={`language-${language}`}>{part}</code>
          </pre>
        );
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className="rounded-2xl glass-panel p-6 max-h-[300px] overflow-y-auto"
    >
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {formatText(displayText)}
        {isGenerating && charIndex >= text.length && (
          <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse"></span>
        )}
      </div>
    </div>
  );
};

export default AssistantResponse;
