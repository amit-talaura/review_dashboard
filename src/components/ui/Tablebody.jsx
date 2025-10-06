import React from "react";
import { formatDate } from "../../utils/helpers";

const TableBody = ({ tableData = [], keyToRender, span, renderActions }) => {
  if (!tableData.length) return null;

  return tableData.map((row) => (
    <div
      key={row._id}
      className="grid grid-cols-12 text-sm items-center hover:bg-blue-50 duration-150 transition-all border-b border-gray-300"
    >
      {keyToRender.map((key, index) => {
        const value =
          key.key === "createdAt" ? formatDate(row.createdAt) : row[key.key];
        return (
          <div
            key={index}
            className={`p-3 col-span-${span[index]} ${
              key.text ? "text-center" : ""
            }`}
          >
            <p>{value}</p>
          </div>
        );
      })}
      {renderActions && renderActions(row)}
    </div>
  ));
};

export default TableBody;
