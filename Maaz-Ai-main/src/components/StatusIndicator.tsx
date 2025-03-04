
import React from 'react';
import { Brain, Search, Cog, Cpu, ZapIcon } from 'lucide-react';
import { AssistantStatus } from '@/lib/assistant';

interface StatusIndicatorProps {
  status: AssistantStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusDetails = () => {
    switch (status) {
      case 'thinking':
        return {
          icon: Brain,
          text: 'Thinking',
          className: 'assistant-status-thinking',
          animation: 'animate-pulse-slow'
        };
      case 'searching':
        return {
          icon: Search,
          text: 'Searching',
          className: 'assistant-status-searching',
          animation: 'animate-pulse-slow'
        };
      case 'doing':
        return {
          icon: Cog,
          text: 'Processing',
          className: 'assistant-status-doing',
          animation: 'animate-spin'
        };
      case 'generating':
        return {
          icon: Cpu,
          text: 'Generating',
          className: 'assistant-status-generating',
          animation: 'animate-pulse-slow'
        };
      case 'idle':
      default:
        return {
          icon: ZapIcon,
          text: 'Available',
          className: 'assistant-status-available',
          animation: ''
        };
    }
  };

  const { icon: Icon, text, className, animation } = getStatusDetails();

  return (
    <div className={`assistant-status-chip ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${animation}`} />
      <span>{text}</span>
    </div>
  );
};

export default StatusIndicator;
