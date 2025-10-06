import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({ options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasOptions = options && options.length > 0;

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (hasOptions) setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full my-3.5" ref={dropdownRef}>
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={!hasOptions}
          className={`w-full bg-white border text-left py-2 px-4 rounded-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${
              hasOptions
                ? "border-gray-300 hover:border-gray-400 cursor-pointer"
                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {value || "Select an option"}
          <span className="float-right">
            <svg
              className={`w-4 h-4 inline ml-2 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              } ${!hasOptions ? "text-gray-300" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.25 7.5L10 12.25L14.75 7.5H5.25Z" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <li
                key={index}
                className={`cursor-pointer px-4 py-2 hover:bg-blue hover:text-white`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
