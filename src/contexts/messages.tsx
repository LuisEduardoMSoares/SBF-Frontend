import React, { useCallback, useState } from 'react';
interface MessagesProps {
  message: MessagesDataProps | null;
  isOpen: boolean;
  showMessage(messageObject:MessagesDataProps): void;
  hideMessage(): any;
}

type messageType = 'error' | 'success' | 'warning' | 'info'
interface MessagesDataProps {
  type?: messageType;
  title?: string;
  text?: string;
  action?: object;
  timeout?: number;
}

export const MessagesContext = React.createContext({} as MessagesProps);

export default function MessagesProvider({ children }: any) {
  const [message, setMessage] = useState<MessagesDataProps | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function showMessage(messageObject: MessagesDataProps) { 
    setMessage(messageObject);
    setIsOpen(true);
  };

  async function hideMessage() {
    setIsOpen(false);

    // TODO: timeout pra excluir a mensagem sem dar erro (corrigir)
    setTimeout(() => {
      setMessage(null);
    }, 400); 
  }

  const contextValue = {
    isOpen,
    message,
    showMessage: useCallback((messageObject: MessagesDataProps) => { showMessage(messageObject) }, []),
    hideMessage: useCallback(() => hideMessage(), []),
  }

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  )
}