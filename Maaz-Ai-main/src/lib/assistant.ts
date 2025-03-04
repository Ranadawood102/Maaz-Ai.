
export type AssistantStatus = 'idle' | 'thinking' | 'searching' | 'doing' | 'generating';

export interface AssistantState {
  status: AssistantStatus;
  query: string;
  response: string;
  history: Array<{
    query: string;
    response: string;
    timestamp: Date;
  }>;
}

export interface AssistantAction {
  type: 'SET_STATUS' | 'SET_QUERY' | 'SET_RESPONSE' | 'ADD_TO_HISTORY' | 'RESET';
  payload?: any;
}

export const initialAssistantState: AssistantState = {
  status: 'idle',
  query: '',
  response: '',
  history: [],
};

export function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case 'SET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_RESPONSE':
      return { ...state, response: action.payload };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [
          ...state.history,
          {
            query: state.query,
            response: state.response,
            timestamp: new Date(),
          },
        ],
      };
    case 'RESET':
      return {
        ...state,
        status: 'idle',
        query: '',
        response: '',
      };
    default:
      return state;
  }
}

// This is a mock function in place of actual AI processing
// In a real implementation, this would connect to a language model
export async function processQuery(query: string): Promise<string> {
  // For demonstration purposes, this creates varied responses
  const commonPhrases = [
    "I'm here to assist you with that request.",
    "I'd be happy to help with that.",
    "Let me process that for you.",
    "I'm analyzing your request now.",
  ];
  
  const randomPhrase = commonPhrases[Math.floor(Math.random() * commonPhrases.length)];
  
  // Create demo responses based on keywords
  if (query.toLowerCase().includes('weather')) {
    return `${randomPhrase} Based on current data, the weather appears to be clear with temperatures around 72°F. Would you like me to provide more detailed forecast information?`;
  } else if (query.toLowerCase().includes('time')) {
    return `${randomPhrase} The current time is ${new Date().toLocaleTimeString()}.`;
  } else if (query.toLowerCase().includes('search') || query.toLowerCase().includes('find')) {
    return `${randomPhrase} I've found several relevant results for your search. Would you like me to summarize the top findings or provide more specific information about any particular aspect?`;
  } else if (query.toLowerCase().includes('code') || query.toLowerCase().includes('program')) {
    return `${randomPhrase} Here's a sample code snippet that might help with your task:\n\n\`\`\`python\ndef process_data(input_data):\n    results = []\n    for item in input_data:\n        if item.is_valid():\n            results.append(item.transform())\n    return results\n\`\`\`\n\nWould you like me to explain how this works or modify it for your specific needs?`;
  } else {
    // Generic response
    return `${randomPhrase} I'm currently in development mode with limited functionality, but I'm designed to assist with various tasks including searches, code generation, and decision-making. How else can I help you today?`;
  }
}
