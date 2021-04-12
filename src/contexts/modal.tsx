import { useContextualRouting } from "hooks/useContextualRouting";
import { useRouter } from "next/router";
import React, {useCallback, useEffect, useState} from "react";

interface ModalContextProps {
  isModalOpen: boolean
  modalRoute: any
  modalContent: any
  modalTitle: any
  modalParams: any
  toggleModal({content, title, route}: ModalProps): void
}

interface ModalProps {
  title?: any
  content?: any
  route?: any
  params?: any
}

export const ModalContext = React.createContext({} as ModalContextProps)

export default function ModalProvider({ children }: any) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalRoute, setModalRoute] = useState(null);
  const [modalParams, setModalParams] = useState({});
  const router = useRouter();
  const { makeContextualHref, returnHref } = useContextualRouting()

  function toggleModal({ content, title, route, params }: ModalProps) {
    setModalOpen(isModalOpen => !isModalOpen)
    setModalContent(content)
    setModalTitle(title)
    setModalRoute(route)
    setModalParams(params)
  }

  const contextValue = {
    isModalOpen,
    modalContent,
    modalTitle,
    modalRoute,
    modalParams,
    toggleModal: useCallback(({content, title, route, params}: ModalProps) => { toggleModal({content, title, route, params}) },[])
  }

  useEffect(() => {
    console.log(isModalOpen ? "Modal opened" : "Modal Closed")
    router.push(
      makeContextualHref(modalParams), modalRoute ? `${returnHref}/${modalRoute}` : `${returnHref}` ,{shallow: true}
    )
  },[isModalOpen])

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}