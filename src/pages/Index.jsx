import React, { useState } from "react";

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
    MessageSquarePlus: (
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
        <path d="M12 7v6" />
        <path d="M15 10h-6" />
      </svg>
    ),
  };
  return icons[name] || null;
};
// --- END ICON LIBRARY ---

// --- MOCK DATA ---
const MOCK_USERS = [
  "Alex Chen",
  "Priya Sharma",
  "Omar Hassan",
  "Emily Brown",
  "Javi Rodriguez",
];

const INITIAL_REPORTS = [
  {
    id: 1,
    userName: "Alice J.",
    date: "2025-10-07",
    option: "phone",
    comment:
      "The contact number listed for Alice J. is outdated. New number is 555-4001.",
    isResolved: false,
  },
  {
    id: 2,
    userName: "Bob L.",
    date: "2025-10-06",
    option: "mismatch",
    comment:
      "The profile photo belongs to a different Bob. Mismatch likely due to similar names.",
    isResolved: false,
  },
  {
    id: 3,
    userName: "Charlie V.",
    date: "2025-10-05",
    option: "repeat",
    comment:
      "The address field for Charlie V. is clearly wrong; this is the third time this report has appeared.",
    isResolved: false,
  },
  {
    id: 4,
    userName: "Diana R.",
    date: "2025-10-04",
    option: "other",
    comment:
      "Reported an issue with notification settings not saving correctly.",
    isResolved: true,
  }, // Resolved item
];

// --- Utility function for Option Tag styling (More creative colors) ---
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

// --- Report List Item Component ---
const ReportListItem = ({ report, allUsers }) => {
  const [isResolved, setIsResolved] = useState(report.isResolved);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [mismatchUser, setMismatchUser] = useState("");
  const [noteText, setNoteText] = useState("");

  const isMismatch = report.option === "mismatch";

  const handleResolve = () => {
    console.log(`Resolving Report ID: ${report.id}. Final Data:`, {
      mismatchUser,
      reviewerNote: noteText,
    });
    setIsResolved(true);
  };

  const handleDelete = () => {
    console.log(`Deleting Report ID: ${report.id}`);
    console.log(
      `[Simulated] Deleting report for ${report.userName}. (Confirmation UI needed)`
    );
  };

  const handleViewConversation = () => {
    console.log(`Viewing conversation history for Report ID: ${report.id}`);
    console.log(
      `[Simulated] Conversation history would appear in a modal or new view.`
    );
  };

  const handleNoteSave = () => {
    console.log(`Saving note for Report ID ${report.id}: "${noteText}"`);
    setShowNoteInput(false);
  };

  const tagClasses = getTagClasses(report.option);

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

        {/* Option Tag - Creatively placed for prominence */}
        <span
          className={`px-4 py-1 text-xs font-black uppercase rounded-full tracking-wider ${tagClasses}`}
        >
          {report.option}
        </span>
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

        {/* Conditional Mismatch Dropdown - Highly Intuitive Block */}
        {isMismatch && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg shadow-inner">
            <label
              htmlFor={`mismatch-user-${report.id}`}
              className="block text-sm font-bold text-red-800 mb-2"
            >
              ⚠️ ACTION REQUIRED: Select Correct Username
            </label>
            <select
              id={`mismatch-user-${report.id}`}
              value={mismatchUser}
              onChange={(e) => setMismatchUser(e.target.value)}
              className="mt-1 block w-full pl-4 pr-10 py-2 text-base border-red-400 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-xl transition duration-200"
            >
              <option value="">-- Choose Replacement User --</option>
              {allUsers.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* REVIEWER COMMENT INPUT AREA */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
        {!showNoteInput ? (
          <button
            onClick={() => setShowNoteInput(true)}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition"
            disabled={isResolved}
          >
            <Icon name="MessageSquarePlus" className="w-4 h-4 mr-1" />
            {isResolved ? "Note Saved" : "+ Add Internal Reviewer Note"}
          </button>
        ) : (
          <div className="space-y-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your findings or actions taken here..."
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-inner"
            ></textarea>
            <button
              onClick={handleNoteSave}
              className="px-4 py-1.5 text-xs font-bold bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition shadow-md"
            >
              Save Note
            </button>
          </div>
        )}
      </div>

      {/* FOOTER: Action Buttons - Clear and Intuitive grouping */}
      <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleViewConversation}
          className="flex items-center px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-sm"
          disabled={isResolved}
        >
          <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
          View Conversation
        </button>

        <button
          onClick={handleResolve}
          disabled={isResolved}
          className={`
            flex items-center px-4 py-2 text-sm font-bold rounded-xl transition shadow-lg
            ${
              isResolved
                ? "bg-green-500 text-white cursor-default opacity-80"
                : "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105"
            }
          `}
        >
          <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
          {isResolved ? "Resolved" : "Resolve"}
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-300 hover:bg-red-100 rounded-xl transition shadow-sm"
          disabled={isResolved}
        >
          <Icon name="Trash2" className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-['Inter']">
      {/* Load Tailwind CSS */}
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Report Review Dashboard 🚀
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This list uses an intuitive, card-based design with clear visual cues
          and conditional UI.
        </p>

        <div className="space-y-6">
          {INITIAL_REPORTS.map((report) => (
            <ReportListItem
              key={report.id}
              report={report}
              allUsers={MOCK_USERS}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
