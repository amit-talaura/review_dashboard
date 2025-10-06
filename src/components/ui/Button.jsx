import React from "react";

const Button = ({ type, className, text, onClick }) => {
  return (
    <button
      type={type}
      className={`${className} rounded-sm text-center px-4 py-1.5 cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
