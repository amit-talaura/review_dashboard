import React, { useEffect, useState } from "react";

const Toast = ({
  type = "success",
  message = "",
  duration = 3000,
  onClose,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => setShow(true), 10);

    const exitTimer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onClose?.(), 500);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 
        px-6 py-3 rounded shadow-lg text-base font-medium z-50
        transition-all duration-500 ease-in-out
        ${show ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}
        ${
          type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
    >
      {message}
    </div>
  );
};

export default Toast;
