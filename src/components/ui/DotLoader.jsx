import React from "react";

const DotLoader = ({ className }) => {
  return (
    <div className="flex items-center gap-2">
      {[...Array(3)].map((_, index) => {
        return (
          <div
            className={`w-1 h-1 rounded-full bg-blue-600 dot-${
              index + 1
            } dots ${className}`}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default DotLoader;
