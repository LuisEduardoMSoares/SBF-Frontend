import React, { useCallback, useState } from 'react';

interface MessagesProps {
  message: MessagesDataProps | null;
  isOpen: boolean;
  addMessage(messageObject:MessagesDataProps): void;
  removeMessage(): any;
}
interface MessagesDataProps {
  type?: string;
  title?: string;
  text?: string;
  action?: object;
  timeout?: number;
}

export const MessagesContext = React.createContext({} as MessagesProps);

export default function MessagesProvider({ children }: any) {
  const [message, setMessage] = useState<MessagesDataProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function addMessage(messageObject: MessagesDataProps) { 
    setMessage(messageObject);
    setIsOpen(true);
  };

  async function removeMessage() {
    setIsOpen(false);
    await new Promise(resolve => {
      setTimeout(() => {
        resolve({})
      }, 400);
    });
    setMessage(null);
  }

  const contextValue = {
    isOpen,
    message,
    addMessage: useCallback((messageObject: MessagesDataProps) => { addMessage(messageObject) }, []),
    removeMessage: useCallback(() => removeMessage(), []),
  }

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  )
}