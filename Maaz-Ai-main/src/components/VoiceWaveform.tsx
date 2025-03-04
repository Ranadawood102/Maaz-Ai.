
import React, { useEffect, useState } from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  barsCount?: number;
  color?: string;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  isActive,
  barsCount = 20,
  color = 'bg-primary'
}) => {
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      const intervalId = setInterval(() => {
        setHeights(
          Array.from({ length: barsCount }, () => 
            isActive ? Math.floor(Math.random() * 40) + 10 : 2
          )
        );
      }, 100);

      return () => clearInterval(intervalId);
    } else {
      setHeights(Array.from({ length: barsCount }, () => 2));
    }
  }, [isActive, barsCount]);

  return (
    <div className="flex items-end justify-center h-16 gap-0.5 px-2">
      {heights.map((height, index) => (
        <div
          key={index}
          className={`waveform-bar ${color}`}
          style={{
            height: `${height}%`,
            transition: 'height 0.1s ease-in-out',
            animationDelay: `${index * 0.05}s`
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
