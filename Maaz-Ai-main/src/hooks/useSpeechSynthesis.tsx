
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisProps {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  cancel: () => void;
  speaking: boolean;
  voices: SpeechSynthesisVoice[];
  supported: boolean;
}

export const useSpeechSynthesis = ({
  onStart,
  onEnd,
  onError,
  voice = null,
  rate = 1,
  pitch = 1,
  volume = 1,
}: UseSpeechSynthesisProps = {}): UseSpeechSynthesisReturn => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);

      const loadVoices = () => {
        const voiceOptions = window.speechSynthesis.getVoices();
        setVoices(voiceOptions);
      };

      loadVoices();

      // Chrome loads voices asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;

      // Cancel any ongoing speech
      cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      if (voice) {
        utterance.voice = voice;
      } else if (voices.length > 0) {
        // Find a good English voice by default
        const defaultVoice = voices.find(
          (v) => v.lang.includes('en') && v.localService
        ) || voices[0];
        utterance.voice = defaultVoice;
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        setSpeaking(true);
        if (onStart) onStart();
      };

      utterance.onend = () => {
        setSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        setSpeaking(false);
        if (onError) onError(event);
      };

      window.speechSynthesis.speak(utterance);
    },
    [supported, voices, voice, rate, pitch, volume, onStart, onEnd, onError]
  );

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { speak, cancel, speaking, voices, supported };
};

export default useSpeechSynthesis;
