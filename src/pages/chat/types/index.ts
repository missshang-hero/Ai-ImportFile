import type { Conversation } from '@ant-design/x/es/conversations';
import React from 'react';

export type BubbleDataType = {
  role: string;
  content: string;
  type?: string;
  files?: File[];
};

export interface CopilotProps {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
}

// ChatHeader 组件 Props
export interface ChatHeaderProps<T> {
  title: string;
  sessionList: Conversation[];
  curSession: string;
  setSessionList: (sessions: Conversation[]) => void;
  setCurSession: (sessionKey: string) => void;
  setMessages: (messages: T[]) => void;
  setCopilotOpen: (open: boolean) => void;
  messages: T[];
  abortController: React.MutableRefObject<AbortController | null>;
  messageHistory: Record<string, T[]>;
}

// ChatList 组件 Props
export interface ChatListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages?: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  welcomeCardData?: any;
  MOCK_QUESTIONS?: string[];
  handleUserSubmit?: (question: string) => void;
  AGENT_PLACEHOLDER?: string;
  showConfirmBox?: boolean;
  showQuickActions?: boolean;
  onConfirmError?: () => void;
  onConfirmSuccess?: () => void;
  onDownloadTemplate?: () => void;
  onDownloadResult?: () => void;
}

// ChatSender 组件 Props
export interface SuggestionItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  children?: SuggestionItem[];
}

export interface ChatSenderProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  loading: boolean;
  handleUserSubmit: (val: string) => void;
  abortController: React.MutableRefObject<AbortController | null>;
  sendHeader: React.ReactNode;
  MOCK_SUGGESTIONS: SuggestionItem[];
  attachmentsOpen: boolean;
  setAttachmentsOpen: (open: boolean) => void;
  onPasteFile: (file: File, files: FileList) => void;
} 


