/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import AudioPlayer, { pauseAllAudio } from "./AudioPlayer";

import { useDispatch } from "react-redux";
import { formatTime } from "../utils/helpers";
import { FiXCircle } from "react-icons/fi";
import { BiCheckCircle } from "react-icons/bi";

const SaleConversationPopup = ({
  showDetail,
  showDetailRef,
  setShowDetail,

  item,
  httpUrl,
}) => {
  const waveAudioPlayerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const dispatch = useDispatch();

  //unused
  const [playingIndex, setPlayingIndex] = useState(null);

  //   useEffect(() => {
  //     pauseAllAudio();
  //   }, [conversationId]);

  return (
    <div
      className={`fixed top-0 w-full h-screen left-0 flex justify-end items-start transition-all duration-100 z-50 ${
        showDetail ? "translate-x-[0%]" : "translate-x-[100%]"
      }`}
    >
      <div
        ref={showDetailRef}
        className="bg-white w-[40%] h-full py-4 px-6 shadow-lg"
      >
        <div className="flex justify-between items-center w-full py-4">
          <p className="text-2xl font-semibold">Detailed SOP Breakdown</p>
          <FaPlus
            className="rotate-45 w-5 h-5 cursor-pointer"
            onClick={() => {
              pauseAllAudio();
              setShowDetail(false);
            }}
          />
        </div>
        <div className="relative w-full top-0 flex justify-start items-center flex-col h-full pb-10 ">
          <div
            className={`w-full relative h-full pt-3  rounded-md my-2 bg-white`}
            key={`${item?.companyId}`}
          >
            <div className="flex justify-between items-center flex-col relative w-full h-full">
              <div className="flex justify-center items-center flex-col w-full relative h-full">
                <div className="w-full flex justify-between items-center sticky top-0">
                  <p className="font-medium text-[20px]">{item?.username}</p>
                  <div className="flex justify-end items-center w-[65%]">
                    {/* <AudioPlayer
                            url={httpUrl}
                            key={`${httpUrl}-${index}`}
                            ref={audioPlayerRef}
                          /> */}

                    {httpUrl && <AudioPlayer key={httpUrl} url={httpUrl} />}
                  </div>
                </div>
                <div
                  className="border border-gray-200 w-full mt-4"
                  style={{ height: "1px" }}
                />
                <div className="w-full h-[100%] overflow-y-scroll pb-8">
                  <div className="w-full mt-4">
                    <p className="text-xl font-medium">SOP Checklist</p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {item?.sop.map((skill, index) => (
                        <div
                          key={`${skill?.name}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm mr-2">{skill?.name}</span>
                          {skill?.isFollowed ? (
                            <BiCheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <FiXCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center items-start flex-col mt-6">
                    <div className="flex flex-col overflow-hidden w-full">
                      {item?.sop.map((sop, index) => {
                        return (
                          <div
                            key={`${sop?.name}-${index}`}
                            className="border rounded-md my-4"
                          >
                            <div
                              className={`font-semibold p-3 ${
                                sop.isFollowed ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {sop?.name}
                            </div>
                            <p className="text-sm text-gray-600 mt-2 p-3">
                              {sop?.description}
                            </p>

                            <AudioPlayer
                              className={"gap-2 pr-1"}
                              ref={audioPlayerRef}
                              url={httpUrl}
                              key={`${httpUrl}-${index}`}
                              startTime={Math.abs(
                                Math.floor(sop?.sopAudioTimestamp?.start)
                              )}
                              endTime={Math.abs(
                                Math.floor(sop?.sopAudioTimestamp?.end)
                              )}
                              showDuration={false}
                              showCustomDuration={formatTime(
                                Math.abs(
                                  Math.floor(sop?.sopAudioTimestamp?.end)
                                ) -
                                  Math.abs(
                                    Math.floor(sop?.sopAudioTimestamp?.start)
                                  )
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleConversationPopup;
