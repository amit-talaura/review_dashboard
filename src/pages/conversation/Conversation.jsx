/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Card from "../../components/ui/Card";
import {
  formatTime,
  formatTODDMMYYYY,
  pauseAllAudio,
} from "../../utils/helpers";
import { FiCalendar, FiMapPin, FiUser, FiXCircle } from "react-icons/fi";
import Badge from "../../components/ui/Badge";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { RiCheckboxCircleLine } from "react-icons/ri";
import AudioPlayer from "../../components/AudioPlayer";
import { BiCheckCircle } from "react-icons/bi";
import Button from "../../components/Button";
import { useDispatch } from "react-redux";
import Separator from "../../components/ui/Separator";
import SaleConversationPopup from "../../components/SaleConversationPopup";
import Services from "../../network/services/Index";

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

const Conversation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location?.state?.item;
  const optionList = location?.state?.optionList;

  const audioRef = useRef();
  const objectionAudioPlayerRef = useRef();
  const showDetailRef = useRef();

  const [audioLoading, setAudioLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [httpUrl, setHttpUrl] = useState(null);
  const [objection, setObjection] = useState({
    index: 0,
    name: "",
  });
  const [noteText, setNoteText] = useState("");
  const [salespersonList, setSalespersonList] = useState([]);
  const [selectedSalesperson, setSelectedSalesPerson] = useState("");
  const [selectedSalespersonId, setSelectedSalespersonId] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  const handlePresignedUrl = async (uri) => {
    try {
      setAudioLoading(true);

      const res = await fetch(
        "https://devbackendapi.talaura.ai/salesperson/s3AudioData/getPresignedUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ s3Uri: uri.trim() }),
        }
      );

      const data = await res.json();
      console.log("Response data:", data);

      setHttpUrl(data?.preSignedUrl);

      return data;
    } catch (error) {
      console.error("Error fetching presigned URL:", error);
    } finally {
      setAudioLoading(false);
    }
  };

  useEffect(() => {
    console.log("Conversation item.id:", item?.id);
  }, [item?.id]);

  const sopScore = Math.round(
    (item?.sop.filter((sop) => sop?.isFollowed).length / item?.sop?.length) *
      100
  );

  const reportOptions = Array.isArray(optionList) ? optionList : [];
  const isMismatch = reportOptions.some(
    (o) => String(o).toLowerCase() === "mismatch"
  );
  const hasMismTag = reportOptions.some((o) =>
    String(o).toUpperCase().includes("MISM")
  );

  const fetchSalesPerson = async (id) => {
    try {
      const res = await Services.InsightServices.getStoreById(id?.storeId);
      setSalespersonList(res?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };

  const resolveReviewAction = async ({
    insightId,
    actionType,
    newSalesPersonId = "",
    resultComment,
    status = "accept",
  }) => {
    try {
      const payload = {
        insightId: insightId,
        resultComment: resultComment ?? noteText ?? "",
        status,
        action: { type: actionType, NEW_SALES_PERSON_ID: newSalesPersonId },
      };
      const res = await Services.InsightServices.resolveReview(payload);
      console.log("resolve-review response", res?.data);
      setIsResolved(true);
      navigate("/");
    } catch (err) {
      console.error("resolve-review failed", err);
    }
  };

  useEffect(() => {
    const subscribe = handlePresignedUrl(item?.conversationUrl);

    return () => subscribe;
  }, [item]);

  return (
    <div className="w-full h-screen flex justify-center items-start flex-col relative">
      <MdKeyboardArrowLeft
        className="w-10 h-10 absolute top-3 left-3 cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="flex justify-between items-center w-[90%] mx-auto">
        <p className="mx-auto w-[90%] text-2xl font-medium mb-4 pl-2">
          Conversation
        </p>
        {(optionList.length ? optionList : ["other"]).map((opt) => {
          const normalized = String(opt).toLowerCase();
          return (
            <span
              key={`${opt}`}
              className={`px-4 py-2 text-xs font-black uppercase rounded-md tracking-wider mx-2 ${getTagClasses(
                normalized
              )}`}
            >
              {opt}
            </span>
          );
        })}
      </div>
      <Card className="w-[90%] hover:shadow-md transition-shadow mx-auto">
        <div className="grid grid-cols-12 border-b border-gray-300 ">
          <div className="col-span-5 p-4 border-r border-gray-300 bg-slate-50">
            <div className="flex items-start justify-between ">
              <div>
                <div className="flex items-center gap-2">
                  <FiUser className="h-3.5 w-3.5" /> Customer
                  {item?.status && (
                    <Badge
                      className={
                        item?.isConverted
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-[#FFEBEB] text-[#D95252] border border-red-200"
                      }
                    >
                      {item?.isConverted ? "Converted" : "Not Converted"}
                    </Badge>
                  )}
                  <Badge
                    className={
                      item?.intentLevel.toLowerCase() === "High Intent"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : item?.intentLevel.toLowerCase() === "Medium Intent"
                        ? "bg-[#fff1dc] text-[#c38730] border border-[#efd5ae]"
                        : "bg-[#FFEBEB] text-[#D95252] border border-red-200"
                    }
                  >
                    {item?.intentLevel}
                  </Badge>
                  <Badge
                    className={
                      item?.isFollowupRequired
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-[#FFEBEB] text-[#D95252] border border-red-200"
                    }
                  >
                    Follow up <MdKeyboardArrowLeft /> 15 days
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                  <span className="flex items-center justify-center gap-1">
                    <FiUser className="h-3.5 w-3.5" />
                    {item?.username}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <FiCalendar className="h-3.5 w-3.5" />{" "}
                    {formatTODDMMYYYY(item?.insightDate.split("T")[0])}
                  </span>

                  <span className="flex items-center gap-1">
                    <FiMapPin className="h-3.5 w-3.5" />
                    {item?.storeName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`col-span-4 p-4 flex items-start  flex-col relative justify-center`}
          >
            <div className="w-full">
              <AudioPlayer key={httpUrl} ref={audioRef} url={httpUrl} />
            </div>
          </div>
          <div className="col-span-3 p-4 border-l border-gray-300 bg-slate-50">
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500 mb-1">
                SOP Checklist
              </p>
              <div className="flex justify-center">
                <div className="relative h-13 w-13">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={
                        sopScore >= 80
                          ? "#10b981"
                          : sopScore >= 60
                          ? "#f59e0b"
                          : "#ef4444"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${sopScore} ${100 - sopScore}`}
                      strokeDashoffset="25"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-semibold">
                      {isNaN(sopScore) ? 0 : sopScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 max-h-[500px] overflow-scroll ">
          <div className="col-span-9 divide-y  ">
            <div className="w-full flex items-center border-gray-300 border-b border-r">
              <div className="px-3 border-r border-gray-300">
                <p className="text-gray-400 font-medium">Objections</p>
              </div>
              <div className="w-full px-3 py-2 flex flex-nowrap gap-4 overflow-x-scroll">
                {item?.objections
                  ?.filter((obj, index, arr) => {
                    if (obj?.name?.toLowerCase().startsWith("other")) {
                      return (
                        index ===
                        arr.findIndex((o) =>
                          o?.name?.toLowerCase().startsWith("other")
                        )
                      );
                    }
                    return true;
                  })
                  .map((obj, index) => {
                    return (
                      <Badge
                        key={index}
                        className={`rounded-md cursor-pointer border duration-75 transition-all ${
                          obj?.resolution
                            ? "bg-green-100 text-green-800  border-green-200"
                            : "bg-[#FFEBEB] text-[#D95252] border-red-200"
                        } ${objection.index === index && "font-semibold"}  ${
                          objection.index === index
                            ? obj?.resolution
                              ? "border-green-600"
                              : "border-red-600"
                            : obj?.resolution
                            ? "border-green-300"
                            : "border-red-300"
                        }`}
                        onClick={() => {
                          setObjection({
                            index: index,
                            name: obj.name,
                          });
                          pauseAllAudio();
                        }}
                      >
                        {obj.name}
                      </Badge>
                    );
                  })}
              </div>
              <div
                className="px-3 border-l border-gray-900 "
                onClick={() =>
                  httpUrl || audioLoading
                    ? null
                    : handlePresignedUrl(
                        item?.conversationUrl,
                        objectionAudioPlayerRef
                      )
                }
              >
                {item?.objections?.length > 0 ? (
                  <AudioPlayer
                    url={httpUrl}
                    ref={objectionAudioPlayerRef}
                    showProgressBar={false}
                    className={"pb-0"}
                    startTime={Math.abs(
                      Math.floor(
                        item?.objections[objection.index]?.objAudioTimestamp
                          ?.start
                      )
                    )}
                    endTime={Math.abs(
                      Math.floor(
                        item?.objections[objection.index]?.objAudioTimestamp
                          ?.end
                      )
                    )}
                    showDuration={false}
                    showCustomDuration={formatTime(
                      Math.abs(
                        Math.floor(
                          item?.objections[objection.index]?.objAudioTimestamp
                            ?.end
                        )
                      ) -
                        Math.floor(
                          item?.objections[objection.index]?.objAudioTimestamp
                            ?.start
                        )
                    )}
                  />
                ) : null}
              </div>
            </div>
            <div className="w-full p-3 border-r border-gray-300">
              <div className="pl-0 pb-4">
                <p className="text-sm text-slate-600 mb-1 font-medium">
                  Resolution offered:
                </p>
                <ul className="list-disc pl-5 text-sm">
                  {item?.objections[objection.index]?.description
                    ?.split(".")
                    .map((sentence, index) => {
                      const trimmedSentence = sentence.trim();
                      return trimmedSentence ? (
                        <li key={index}>{trimmedSentence}</li>
                      ) : null;
                    })}
                </ul>
              </div>

              {item?.discussedProducts.length > 0 ? (
                <div className="pl-0 pb-4">
                  <p className="text-sm text-slate-600 mb-1 font-medium">
                    Product Discussed:
                  </p>
                  <ul className="list-disc text-sm mt-2 flex flex-wrap gap-4 items-start">
                    {item?.discussedProducts.map((tag, index) => {
                      return (
                        <div
                          className="relative group inline-block"
                          key={index}
                          data-product-discussed="Product Discussed"
                          //   onMouseEnter={(e) =>
                          //     handleMouseEnter(
                          //       e?.currentTarget?.dataset?.productDiscussed,
                          //       tag?.name,
                          //       getKeys?.companyId,
                          //       getKeys?.userId,
                          //       data,
                          //       sopScore
                          //     )
                          //   }
                        >
                          <button className="border cursor-pointer rounded-full px-4 py-1 border-gray-600 text-[rgba(0,0,0,1)] inline-flex items-center whitespace-nowrap">
                            {tag.name}
                          </button>

                          <div
                            className={`w-[500px] z-20 absolute left-0 mt-2 hidden group-hover:block text-white text-xs p-3 shadow-md rounded ${
                              !tag.isConverted ? "bg-red-100" : "bg-green-100"
                            } before:absolute before:top-[-15px] before:left-4 before:border-8 before:border-transparent before:border-b-[8px] ${
                              !tag.isConverted
                                ? "before:border-b-red-100"
                                : "before:border-b-green-100"
                            }`}
                          >
                            <p className="text-black inline-flex items-center mt-1">
                              Intent: {tag.intentLevel}
                            </p>
                            <p className="text-black mt-1">
                              Reason: {tag.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              {item?.crossSales.length > 0 ? (
                <div className="pl-0 pb-4">
                  <p className="text-sm text-slate-600 mb-1 font-medium">
                    Cross Sale Attempt:
                  </p>
                  <ul className="list-disc text-sm mt-2 flex flex-wrap gap-4 items-start">
                    {item?.crossSales.map((tag, index) => {
                      return (
                        <div
                          className="relative group inline-block"
                          key={index}
                          data-cross-sale="Cross Sale Attempt"
                          //   onMouseEnter={(e) =>
                          //     handleMouseEnter(
                          //       e?.currentTarget?.dataset?.crossSale,
                          //       tag?.name,
                          //       getKeys?.companyId,
                          //       getKeys?.userId,
                          //       data,
                          //       sopScore
                          //     )
                          //   }
                        >
                          <button className="border cursor-pointer rounded-full px-4 py-1 border-gray-600 text-[rgba(0,0,0,1)] inline-flex items-center whitespace-nowrap">
                            {tag.product}
                          </button>

                          <div
                            className={`w-[500px] z-20 absolute left-0 mt-2 hidden group-hover:block text-white text-xs p-3 shadow-md rounded ${
                              tag.isConverted === false
                                ? "bg-red-100"
                                : "bg-green-100"
                            } before:absolute before:top-[-15px] before:left-4 before:border-8 before:border-transparent before:border-b-[8px] ${
                              tag.isConverted === false
                                ? "before:border-b-red-100"
                                : "before:border-b-green-100"
                            }`}
                          >
                            {/* <p className="text-black inline-flex items-center">
                                Price:{" "}
                                <LuIndianRupee className="w-3 h-3 text-black ml-1" />
                                {tag.price}
                                <PiApproximateEquals />
                              </p> */}
                            <p className="text-black mt-2">{tag.context}</p>
                          </div>
                        </div>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="flex justify-between items-start flex-col">
                {hasMismTag && (
                  <div className="p-4 bg-red-50 border border-red-300 rounded-lg shadow-inner w-full mb-4">
                    <label
                      htmlFor={`mismatch-user-${item?.id}`}
                      className=" text-sm font-bold text-red-800 mb-2"
                    >
                      ⚠️ ACTION REQUIRED: Select Correct Username
                    </label>
                    <select
                      id={`mismatch-user-${item?.id}`}
                      value={selectedSalespersonId}
                      onChange={(e) => {
                        setSelectedSalespersonId(e.target.value);
                        const selectedOption = e.target.selectedOptions?.[0];
                        if (selectedOption)
                          setSelectedSalesPerson(selectedOption.text);
                      }}
                      onClick={() => fetchSalesPerson(item)}
                      className="mt-1 block w-full pl-4 pr-10 py-2 text-base border-red-400 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-xl transition duration-200"
                    >
                      <option value="">-- Replacement User --</option>
                      {salespersonList &&
                        salespersonList.map((opt) => (
                          <option
                            key={opt._id || opt.id || opt.name}
                            value={opt._id || opt.id}
                          >
                            {opt.name || opt.fullName || opt.username}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type your findings or actions taken here..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-inner"
                ></textarea>

                <div className="flex justify-end w-full items-center mt-4 gap-4">
                  {hasMismTag && (
                    <button
                      onClick={() =>
                        resolveReviewAction({
                          actionType: "CHANGE_SALES_PERSON",
                          newSalesPersonId: selectedSalespersonId,
                          resultComment: noteText,
                          insightId: item?._id,
                        })
                      }
                      disabled={isResolved || !selectedSalespersonId}
                      className={`cursor-pointer
                        flex items-center px-4 py-2 text-sm font-bold rounded-xl transition shadow-lg
                        ${
                          isResolved
                            ? "bg-green-500 text-white cursor-default opacity-80"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105"
                        }
                        ${
                          isResolved || !selectedSalespersonId
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >
                      <Icon name="CheckCircle" className="w-4 h-4 mr-2" />
                      Update Sales Person
                    </button>
                  )}

                  <button
                    onClick={() =>
                      resolveReviewAction({
                        insightId: item?._id,
                        actionType: "REVIEW_DENIED",
                      })
                    }
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
                    onClick={() =>
                      resolveReviewAction({
                        insightId: item?._id,
                        actionType: "DELETE",
                      })
                    }
                    className=" cursor-pointer flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-300 hover:bg-red-100 rounded-xl transition shadow-sm"
                    disabled={isResolved}
                  >
                    <Icon name="Trash2" className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 px-4 pt-5 bg-slate-50  overflow-scroll relative ">
            <div className="space-y-3 h-full">
              {isNaN(sopScore)
                ? [
                    "After Service Objections",
                    "Cross Sale",
                    "Current Brand of Mattress",
                    "Customer Interaction & USP",
                    "Google Review",
                    "Greetings & Assistance",
                    "Memory Foam Comparison",
                    "Other Objections",
                    "Price Objections",
                    "Product Knowledge",
                    "Purchase Motivation",
                    "Referral",
                    "Retail 2.0",
                    "SmartGRID Technology",
                    "Tailored Product Recommendations",
                    "Warranty Objections",
                  ].map((sop) => {
                    return (
                      <div
                        key={sop}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{sop}</span>
                        <FiXCircle className="h-5 w-5 text-red-500" />
                      </div>
                    );
                  })
                : item?.sop?.map((sop, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{sop?.name}</span>
                      {sop.isFollowed ? (
                        <BiCheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <FiXCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}

              <div className="sticky bottom-0 bg-slate-50 py-2">
                <Button
                  // variant="ghost"
                  size="sm"
                  className="w-full text-white !bg-[# 2463ea] h-8 hover:!bg-[#2463ea] "
                  onClick={() => {
                    setShowDetail(true);

                    // handleClick();
                    // pauseAllAudios();
                  }}
                >
                  <Separator className={"sticky bottom-0"} />
                  Detailed SOP Breakdown
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SaleConversationPopup
          setShowDetail={setShowDetail}
          showDetail={showDetail}
          showDetailRef={showDetailRef}
          item={item}
          key={`${httpUrl}`}
          httpUrl={httpUrl}
        />
      </Card>
    </div>
  );
};

export default Conversation;
