import React from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";

const PageHeading = ({ headings }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      {headings &&
        headings.map((heading, index) => (
          <div key={index} className="flex items-center gap-2">
            <h1
              className={`text-xl font-semibold whitespace-nowrap ${
                index < headings.length - 1 ? "text-[#797979]" : "text-black"
              }`}
            >
              {heading}
            </h1>
            {index < headings.length - 1 && (
              <MdKeyboardArrowLeft size={24} className="rotate-180 font-bold" />
            )}
          </div>
        ))}
    </div>
  );
};

export default PageHeading;
