
import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; // Import toast directly from sonner
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import useSpeechSynthesis from '@/hooks/useSpeechSynthesis';
import StatusIndicator from './StatusIndicator';
import VoiceWaveform from './VoiceWaveform';
import AssistantResponse from './AssistantResponse';
import CommandHistory from './CommandHistory';
import { 
  assistantReducer, 
  initialAssistantState,
  processQuery
} from '@/lib/assistant';

export const VoiceAssistant: React.FC = () => {
  const [state, dispatch] = useReducer(assistantReducer, initialAssistantState);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast: uiToast } = useToast();

  // Speech recognition setup
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
    interimTranscript,
  } = useSpeechRecognition({
    onResult: (result) => {
      setInputValue((prev) => prev + ' ' + result);
    },
    onEnd: () => {
      // Optional: Auto-submit when speech ends
      // if (inputValue.trim()) {
      //   handleSubmit();
      // }
    },
  });

  // Speech synthesis setup
  const { speak, cancel, speaking, voices, supported: hasSynthesisSupport } = useSpeechSynthesis({
    onStart: () => {
      dispatch({ type: 'SET_STATUS', payload: 'generating' });
    },
    onEnd: () => {
      dispatch({ type: 'SET_STATUS', payload: 'idle' });
    },
  });

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    // Update state with the query
    dispatch({ type: 'SET_QUERY', payload: inputValue.trim() });
    dispatch({ type: 'SET_STATUS', payload: 'thinking' });
    dispatch({ type: 'SET_RESPONSE', payload: '' });

    try {
      // In a real implementation, this would be an API call to an LLM
      // Simulate loading with setTimeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll sometimes show "searching" status
      if (inputValue.toLowerCase().includes('search') || Math.random() > 0.7) {
        dispatch({ type: 'SET_STATUS', payload: 'searching' });
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      // Sometimes show "doing" status too
      if (Math.random() > 0.6) {
        dispatch({ type: 'SET_STATUS', payload: 'doing' });
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const response = await processQuery(inputValue);
      
      // Update state with the response
      dispatch({ type: 'SET_STATUS', payload: 'generating' });
      dispatch({ type: 'SET_RESPONSE', payload: response });
      
      // Add to history
      dispatch({ type: 'ADD_TO_HISTORY' });
      
      // Speak the response if speech synthesis is supported
      if (hasSynthesisSupport) {
        speak(response);
      }
      
      // Clear input
      setInputValue('');
      
    } catch (error) {
      console.error('Error processing query:', error);
      uiToast({
        title: 'Error',
        description: 'There was an error processing your request.',
        variant: 'destructive',
      });
      dispatch({ type: 'SET_STATUS', payload: 'idle' });
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      if (hasRecognitionSupport) {
        startListening();
        toast('Listening...', {
          description: 'Speak clearly into your microphone',
          duration: 3000,
        });
      } else {
        toast('Speech recognition not supported', {
          description: 'Your browser does not support speech recognition.',
          duration: 3000,
        });
      }
    }
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(true);
  };

  // Handle selecting a history item
  const handleSelectHistoryItem = (query: string) => {
    setInputValue(query);
  };

  // Detect when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speaking) {
        cancel();
      }
    };
  }, [speaking, cancel]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto gap-6">
      <div className="w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* Assistant Header with Status */}
          <div className="glass-panel p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">JARVIS</h2>
                <StatusIndicator status={state.status} />
              </div>
            </div>
            
            <VoiceWaveform 
              isActive={isListening || speaking || state.status === 'generating'} 
              barsCount={12}
            />
          </div>
          
          {/* Assistant Response */}
          <AssistantResponse 
            text={state.response}
            isGenerating={state.status === 'generating'} 
          />
          
          {/* Voice Input Form */}
          <form onSubmit={handleSubmit} className="glass-panel p-3 flex gap-2">
            <Input
              value={inputValue}
              onChange={handleInputChange}
              placeholder={isListening ? interimTranscript || 'Listening...' : 'Type your command or ask a question...'}
              className="bg-transparent border-none shadow-none focus-visible:ring-0 flex-1"
              disabled={isListening}
            />
            <Button 
              type="button" 
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={cn(
                "transition-colors",
                isListening ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" : ""
              )}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
        
        {/* Command History */}
        <div className="w-full md:w-64">
          <CommandHistory 
            history={state.history}
            onSelectHistoryItem={handleSelectHistoryItem}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
