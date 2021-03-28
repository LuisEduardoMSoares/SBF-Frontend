import { MessagesContext } from 'contexts/messages';
import { useContext } from 'react';

function useMessages() {
  const { message, isOpen, showMessage, hideMessage } = useContext(MessagesContext);
  return { message, isOpen, showMessage, hideMessage };
}

export default useMessages;