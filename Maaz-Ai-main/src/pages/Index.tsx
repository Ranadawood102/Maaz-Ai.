
import React from 'react';
import VoiceAssistant from '@/components/VoiceAssistant';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Your Intelligent Assistant
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Speak or type your commands to interact with your AI assistant. It can help with searches, 
            task automation, coding, and more.
          </p>
        </header>
        
        <main className="animate-scale-in animation-delay-150">
          <VoiceAssistant />
        </main>
        
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>Voice assistant powered by browser speech APIs</p>
          <p className="mt-1">For optimal experience, use a modern browser with microphone access</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
