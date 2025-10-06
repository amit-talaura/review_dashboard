import { createPortal } from "react-dom";

const Modal = ({ open, children, className }) => {
  if (!open) return null;
  return createPortal(
    <div className={`fixed top-0 left-0 ${className}`}>{children}</div>,
    document.body
  );
};

export default Modal;
