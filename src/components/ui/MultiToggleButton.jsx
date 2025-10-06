import React from "react";
import { FaCheck, FaPlus } from "react-icons/fa";

const MultiToggleButton = ({ options, selected = [], onChange }) => {
  const handleToggle = (option) => {
    const isSelected = selected.includes(option);
    const updated = isSelected
      ? selected.filter((item) => item !== option)
      : [...selected, option];

    onChange(updated);
  };

  // Utility to capitalize only for display
  const formatLabel = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected?.includes(option);

        return (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            className={`flex items-center px-4 py-2 rounded-full border text-sm font-medium transition cursor-pointer ${
              isSelected
                ? "bg-blue-50 border-blue-300 text-black"
                : "bg-white border-gray-300 text-gray-500"
            }`}
          >
            {isSelected ? (
              <FaCheck className="text-blue-600 mr-2 text-sm" />
            ) : (
              <FaPlus className="text-gray-400 mr-2 text-sm" />
            )}
            {formatLabel(option)} {/* Display with capitalized first letter */}
          </button>
        );
      })}
    </div>
  );
};

export default MultiToggleButton;
