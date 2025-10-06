import React from "react";

const Modal = ({ children, className }) => {
  return (
    <div
      className={`w-full h-screen fixed top-0 left-0 flex justify-center items-center bg-black-100 z-50 ${className}`}
    >
      {children}
    </div>
  );
};

export default Modal;
