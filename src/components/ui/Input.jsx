import React from "react";

const Input = ({
  type,
  name,
  placeholder,
  value,
  onChange,
  inputClassName,
  className,
  onBlur,
  icon,
}) => {
  return (
    <div
      className={`border px-3.5 py-1.5 flex justify-between items-center ${className}`}
    >
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`focus:outline-none ${inputClassName}`}
      />
      {icon}
    </div>
  );
};

export default Input;
