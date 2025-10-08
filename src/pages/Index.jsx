import React, { useEffect, useState } from "react";
import { INITIAL_REPORTS, MOCK_USERS } from "../constants/mockData";
import Services from "../network/services/Index";
import { useNavigate } from "react-router-dom";

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
const ReportListItem = ({ report, allUsers, conversation, index }) => {
  const navigate = useNavigate();
  const [isResolved, setIsResolved] = useState(report.isResolved);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [mismatchUser, setMismatchUser] = useState("");
  const [noteText, setNoteText] = useState("");

  const optionList = Array.isArray(report.options)
    ? report.options
    : report.option
    ? [report.option]
    : [];
  const isMismatch = optionList.some(
    (o) => String(o).toLowerCase() === "mismatch"
  );

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

  const handleViewConversation = (optionList) => {
    navigate("/conversation", {
      state: { item: conversation?.data[index], optionList },
    });
    console.log(`Viewing conversation history for Report ID: ${report.id}`);
  };

  const handleNoteSave = () => {
    console.log(`Saving note for Report ID ${report.id}: "${noteText}"`);
    setShowNoteInput(false);
  };

  const handleMismatchSelect = async (e) => {
    const selected = e.target.value;

    setMismatchUser(selected);
    try {
      const storeId =
        report.storeId ||
        report.store?.id ||
        report.reviews?.[0]?.storeId ||
        "689586632877a2a9eb7ef19b";
      if (storeId) {
        const res = await Services.InsightServices.getStoreById(storeId);
        console.log("Fetched store for mismatch:", storeId, res?.data);
      } else {
        console.warn("No storeId found on report to fetch store details.");
      }
    } catch (err) {
      console.error("Failed to fetch store details:", err);
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
                {opt}--
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
              onChange={handleMismatchSelect}
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
          onClick={() => handleViewConversation(optionList)}
          className="cursor-pointer flex items-center px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-sm"
          disabled={isResolved}
        >
          <Icon name="MessageSquare" className="w-4 h-4 mr-2" />
          View Conversation
        </button>

        <button
          onClick={() => null}
          // disabled={isResolved}
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
          onClick={handleResolve}
          disabled={isResolved}
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
          {isResolved ? "Resolved" : "Resolve"}
        </button>

        <button
          onClick={handleDelete}
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

// --- Main App Component ---
const Index = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [conversation, setConversation] = useState(null);
  // const companyId = "68957fc5dbfac0c93516cf59";
  const companyId = "679750e71f1ea9b797e8ab55";

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await Services.InsightServices.getInsightReview(companyId);
        const apiData = res?.data;
        // console.log("apiData=======>>>>>>", apiData);
        setConversation(res?.data);
        const candidates = [
          apiData,
          apiData?.data,
          apiData?.items,
          apiData?.records,
          apiData?.result,
          apiData?.results,
          apiData?.list,
        ];
        const list = candidates.find((c) => Array.isArray(c)) || [];

        if (list.length) {
          const mapped = list.map((item, idx) => {
            let options = [];
            if (Array.isArray(item.reviews)) {
              for (const r of item.reviews) {
                const t = r?.type ?? r?.name ?? r?.value;
                if (Array.isArray(t)) {
                  for (const v of t) if (v) options.push(String(v));
                } else if (t) {
                  options.push(String(t));
                }
              }
            } else if (Array.isArray(item.reviewTypes)) {
              for (const v of item.reviewTypes) {
                if (Array.isArray(v)) {
                  for (const s of v) if (s) options.push(String(s));
                } else if (v) options.push(String(v));
              }
            } else if (Array.isArray(item.reviewType)) {
              for (const v of item.reviewType) if (v) options.push(String(v));
            } else if (typeof item.reviewType === "string") {
              options = item.reviewType
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            } else if (typeof item.reviews === "string") {
              options = item.reviews
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            } else if (item.option) {
              if (Array.isArray(item.option)) {
                for (const v of item.option) if (v) options.push(String(v));
              } else {
                options = [String(item.option)];
              }
            }

            const seen = new Set();
            options = options.filter((v) => {
              if (seen.has(v)) return false;
              seen.add(v);
              return true;
            });

            return {
              id: item.id || item._id || idx + 1,
              userName: item.username || item.user || item.name || "Unknown",
              date:
                item.insightDate ||
                item.createdAt ||
                item.updatedAt ||
                new Date().toISOString(),
              options,
              option: options[0] || "other",
              comment:
                item.reviews[0].comment ||
                item.message ||
                item.description ||
                "",
              isResolved: Boolean(item.isResolved ?? item.resolved ?? false),
            };
          });

          setReports(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch insight review:", e);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-['Poppins']">
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
          {reports.map((report, index) => (
            <ReportListItem
              index={index}
              conversation={conversation}
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
