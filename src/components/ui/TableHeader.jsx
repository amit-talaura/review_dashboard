import React from "react";

const TableHeader = ({ headers = [] }) => {
  return (
    <div className="grid grid-cols-12 sticky top-0 bg-gray-100 text-sm font-medium z-10">
      {headers.map((head, index) => (
        <div
          key={index}
          className={`p-3 border-b border-gray-300 col-span-${head.span} ${
            head?.className || ""
          }`}
        >
          <div className="flex items-center gap-2">
            {head.heading}

            {head.optional && <head.optional className="cursor-pointer" />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableHeader;
