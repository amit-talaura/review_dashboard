import React from "react";

const Checkbox = ({ checked, onChange, value, label }) => {
  return (
    <>
      <input
        type="radio"
        id={value}
        name="type"
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-blue-600 focus:ring-indigo-500 border-gray-300"
      />
      <label htmlFor="salesperson" className="text-gray-700">
        {label}
      </label>
    </>
  );
};

export default Checkbox;
