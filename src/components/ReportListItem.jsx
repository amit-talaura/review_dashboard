/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Services from "../network/services/Index";

const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    CheckCircle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 10 12.01" />
      </svg>
    ),
    Trash2: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M15 6V4c0-1-1-2-2-2h-2c-1 0-2 1-2 2v2" />
      </svg>
    ),
    MessageSquare: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

const getTagClasses = (option) => {
  switch (option) {
    case "phone":
      return "bg-blue-600 text-white shadow-md shadow-blue-300/50";
    case "mismatch":
      return "bg-red-600 text-white shadow-md shadow-red-300/50";
    case "repeat":
      return "bg-yellow-500 text-gray-900 shadow-md shadow-yellow-300/50";
    case "other":
    default:
      return "bg-gray-400 text-white shadow-md shadow-gray-300/50";
  }
};

const ReportListItem = ({ report, allUsers, conversation, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isResolved, setIsResolved] = useState(report.isResolved);
  const [noteText, setNoteText] = useState("");
  const [salespersonList, setSalespersonList] = useState([]);
  const [selectedSalesperson, setSelectedSalesPerson] = useState("");
  const [selectedSalespersonId, setSelectedSalespersonId] = useState("");

  const optionList = Array.isArray(report.options)
    ? report.options
    : report.option
    ? [report.option]
    : [];
  const isMismatch = optionList.some(
    (o) => String(o).toLowerCase() === "mismatch"
  );
  const hasMismTag = optionList.some((o) => String(o).toUpperCase().includes("MISM"));

  const handleResolve = () => {
    setIsResolved(true);
  };

  const handleDelete = () => {
    return;
  };

  const handleViewConversation = (optionList) => {
    navigate("/conversation", {
      state: { item: conversation?.data[index], optionList },
    });
  };

  const fetchSalesPerson = async (id) => {
    try {
      const res = await Services.InsightServices.getStoreById(id?.storeId);
      setSalespersonList(res?.data?.result);
  
    } catch (error) {
      console.log(error);
    }
  };

  const resolveReviewAction = async ({ actionType, newSalesPersonId = "", resultComment, status = "accept" }) => {
    try {
      const payload = {
        insightId: report.id,
        resultComment: resultComment ?? noteText ?? "",
        status,
        action: { type: actionType, NEW_SALES_PERSON_ID: newSalesPersonId },
      };
      const res = await Services.InsightServices.resolveReview(payload);
      console.log("resolve-review response", res?.data);
      setIsResolved(true);
    } catch (err) {
      console.error("resolve-review failed", err);
    }
  };

  return (
    <div
      className={`
      p-6 rounded-2xl transition duration-500 transform
      ${
        isResolved
          ? "bg-green-100 border border-green-300 opacity-70"
          : "bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1"
      }
    `}
    >
      {/* HEADER: User Info and Date */}
      <div className="flex justify-between items-start mb-4">
        <div className={`flex flex-col ${isResolved ? "line-through" : ""}`}>
          <h2 className="text-2xl font-extrabold text-gray-900 font-inter">
            {report.userName}
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            Reported on {new Date(report.date).toLocaleDateString()}
          </p>
        </div>

        {/* Option Tags - support multiple */}
        <div className="flex flex-wrap gap-2">
          {(optionList.length ? optionList : ["other"]).map((opt) => {
            const normalized = String(opt).toLowerCase();
            return (
              <span
                key={`${opt}`}
                className={`px-4 py-1 text-xs font-black uppercase rounded-full tracking-wider ${getTagClasses(
                  normalized
                )}`}
              >
                {opt}
              </span>
            );
          })}
        </div>
      </div>

      {/* CORE DETAILS: Comment and Conditional Dropdown */}
      <div className="space-y-4 mb-4">
        {/* Original Comment */}
        <p
          className={`text-gray-700 text-sm p-3 rounded-lg bg-gray-50 border border-gray-200 ${
            isResolved ? "italic text-gray-500" : "font-medium"
          }`}
        >
          <span className="font-bold text-xs text-gray-600 block mb-1">
            USER COMMENT:
          </span>
          {report.comment}
        </p>

        {/* Conditional Mismatch Dropdown */}
        {isMismatch && (
          <div
            className="p-4 bg-red-50 border border-red-300 rounded-lg shadow-inner"
            onClick={() => fetchSalesPerson(conversation?.data[index])}
          >
            <label
              htmlFor={`mismatch-user-${report.id}`}
              className="block text-sm font-bold text-red-800 mb-2"
            >
              ⚠️ ACTION REQUIRED: Select Correct Username
            </label>
            <select
              id={`mismatch-user-${report.id}`}
              value={selectedSalespersonId}
              onChange={(e) => {
                setSelectedSalespersonId(e.target.value);
                const selectedOption = e.target.selectedOptions?.[0];
                if (selectedOption) setSelectedSalesPerson(selectedOption.text);
              }}
              className="mt-1 block w-full pl-4 pr-10 py-2 text-base border-red-400 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-xl transition duration-200"
            >
              <option value="">-- Replacement User --</option>
              {salespersonList &&
                salespersonList.map((opt) => (
                  <option key={opt._id || opt.id || opt.name} value={opt._id || opt.id}>
                    {opt.name || opt.fullName || opt.username}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* REVIEWER COMMENT INPUT AREA */}
      {/* <div className="mt-4 pt-4 border-t border-red-200 space-y-2"> */}
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Type your findings or actions taken here..."
        rows="3"
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-inner"
      ></textarea>
      {/* </div> */}

      {/* FOOTER: Action Buttons */}
      <div className="flex justify-end space-x-3 mt-4 pt-4 ">
        <button
          onClick={() => handleViewConversation(optionList)}
          className="cursor-pointer flex items-center px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-sm"
          disabled={isResolved}
        >
          <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
          View Conversation
        </button>

        {hasMismTag && (
          <button
            onClick={() => resolveReviewAction({ actionType: "CHANGE_SALES_PERSON", newSalesPersonId: selectedSalespersonId, resultComment: noteText })}
            disabled={isResolved || !selectedSalespersonId}
            className={`cursor-pointer
              flex items-center px-4 py-2 text-sm font-bold rounded-xl transition shadow-lg
              ${
                isResolved
                  ? "bg-green-500 text-white cursor-default opacity-80"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105"
              }
              ${(isResolved || !selectedSalespersonId) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
            Update Sales Person
          </button>
        )}

        <button
          onClick={() => resolveReviewAction({ actionType: "REVIEW_DENIED" })}
          className={`cursor-pointer
            flex items-center px-4 py-2 text-sm font-bold rounded-xl transition shadow-lg
            ${
              isResolved
                ? "bg-green-500 text-white cursor-default opacity-80"
                : "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105"
            }
          `}
        >
          <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
          Denied
        </button>
        

        <button
          onClick={() => resolveReviewAction({ actionType: "DELETE" })}
          className=" cursor-pointer flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-300 hover:bg-red-100 rounded-xl transition shadow-sm"
          disabled={isResolved}
        >
          <Icon name="Trash2" className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ReportListItem;
