import { useState } from "react";

export default function useModal() {
  const [modal, setModal] = useState({ type: null, data: null });

  const openModal = (type, data = null) => setModal({ type, data });
  const closeModal = () => setModal({ type: null, data: null });

  const isOpen = (type) => modal.type === type;

  return {
    modal,
    openModal,
    closeModal,
    isOpen
  };
}
