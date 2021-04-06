import { ModalContext } from "contexts/modal";
import { useContext } from "react";

export default function useModal(){
  const { modal, toggleModal, modalContent, modalTitle } = useContext(ModalContext)
  return { modal, toggleModal, modalContent, modalTitle };
};