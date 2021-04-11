import { ModalContext } from "contexts/modal";
import { useContext } from "react";

export default function useModal(){
  const { isModalOpen, toggleModal, modalContent, modalTitle, modalRoute, modalParams } = useContext(ModalContext)
  return { isModalOpen, toggleModal, modalContent, modalTitle, modalRoute, modalParams };
};