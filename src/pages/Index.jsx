/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { INITIAL_REPORTS, MOCK_USERS } from "../constants/mockData";
import Services from "../network/services/Index";
import ReportListItem from "../components/ReportListItem";

// component extracted to src/components/ReportListItem.jsx

// --- Main App Component ---
const Index = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  // const companyId = "68957fc5dbfac0c93516cf59";
  const companyId = "679750e71f1ea9b797e8ab55";

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await Services.InsightServices.getInsightReview(companyId);
        const apiData = res?.data;
        console.log("newsss", apiData);
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
      } finally {
        setLoading(false);
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
          Report Review Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This list uses an intuitive, card-based design with clear visual cues
          and conditional UI.
        </p>

        <div className="space-y-6">
          {loading ? (
            <p>Loading...</p>
          ) : reports.length > 0 ? (
            reports.map((report, index) => (
              <ReportListItem
                key={report.id}
                index={index}
                conversation={conversation}
                report={report}
                allUsers={MOCK_USERS}
              />
            ))
          ) : (
            <p>No data available!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
