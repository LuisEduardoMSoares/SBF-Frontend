import React, {useCallback, useState} from "react";

interface ModalContextProps {
  modal: any
  modalContent: any
  modalTitle: any
  toggleModal({content, title}: ModalProps): void
}

interface ModalProps {
  title?: any
  content?: any
}

export const ModalContext = React.createContext({} as ModalContextProps)

export default function ModalProvider({ children }: any) {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);

  function toggleModal({ content, title }: ModalProps) {
    setModal(modal => !modal)
    if (content) setModalContent(content)
    if (title) setModalTitle(title)
  };

  const contextValue = {
    modal,
    modalContent,
    modalTitle,
    toggleModal: useCallback(({content, title}: ModalProps) => { toggleModal({content, title}) },[])
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}