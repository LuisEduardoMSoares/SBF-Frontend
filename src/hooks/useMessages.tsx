import { useContext } from 'react';
import { MessagesContext } from 'contexts/messages';

function useMessages() {
  const { message, isOpen, showMessage, hideMessage } = useContext(MessagesContext);
  return { message, isOpen, showMessage, hideMessage };
}

export default useMessages;