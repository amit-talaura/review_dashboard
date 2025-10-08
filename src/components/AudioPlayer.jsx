/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Button from "./Button";

import { clearAudio, registerAudio } from "../utils/helpers";
import { FaPause, FaPlay } from "react-icons/fa";

// Global audio playback coordination
const listeners = new Set();

export const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

export const notify = (id) => {
  listeners.forEach((cb) => cb(id));
};

export const pauseAllAudio = () => {
  notify("PAUSE_ALL");
};

let currentlyPlayingAudio = null;

const AudioPlayer = forwardRef(
  (
    {
      url,
      className,
      startTime = null,
      endTime = null,
      showDuration = true,
      showProgressBar = true,
      showCustomDuration = null,

      onLoadedMetadata,
    },
    ref
  ) => {
    const audioRef = useRef(null);
    const animationFrameRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState("0:00");
    const [tooltipTime, setTooltipTime] = useState("0:00");
    const [dragging, setDragging] = useState(false);
    const [hoverX, setHoverX] = useState(0);
    const [rawDuration, setRawDuration] = useState(0);
    const [invalidSegment, setInvalidSegment] = useState(false);
    const uniqueId = useRef(Math.random().toString(36).slice(2));

    const formatTime = (time) => {
      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const trackAudioEvent = useCallback((status) => {
      const audio = audioRef.current;
      if (!audio) return;

      const playedTime = audio.currentTime;
      const totalDuration = audio.duration || 0;
      const percentagePlayed = totalDuration
        ? Math.round((playedTime / totalDuration) * 100)
        : 0;
    }, []);

    useEffect(() => {
      const invalid =
        (startTime !== null && !Number.isFinite(startTime)) ||
        (endTime !== null && !Number.isFinite(endTime)) ||
        (startTime !== null && endTime !== null && startTime >= endTime);
      setInvalidSegment(invalid);
    }, [startTime, endTime]);

    const clampTime = (time) => {
      if (startTime !== null && time < startTime) return startTime;
      if (endTime !== null && time > endTime) return endTime;
      return time;
    };

    const updateSeek = useCallback(
      (clientX) => {
        const audio = audioRef.current;
        const bar = progressBarRef.current;
        if (!audio || !bar) return;

        const rect = bar.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const width = rect.width;
        const percent = Math.max(0, Math.min(offsetX / width, 1));

        const clampedRawTime = clampTime(percent * rawDuration);

        setProgress((clampedRawTime / rawDuration) * 100);
        setTooltipTime(formatTime(clampedRawTime));

        if (dragging) {
          setHoverX(offsetX);
        } else {
          audio.currentTime = clampedRawTime;
        }
      },
      [rawDuration, dragging, startTime, endTime]
    );

    const handleMouseMove = useCallback(
      (e) => {
        if (!dragging) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          updateSeek(e.clientX);
        });
      },
      [dragging, updateSeek]
    );

    const handleMouseDown = (e) => {
      setDragging(true);
      updateSeek(e.clientX);
    };

    const handleMouseUp = useCallback(
      (e) => {
        if (dragging) {
          const audio = audioRef.current;
          const bar = progressBarRef.current;
          if (audio && bar) {
            const rect = bar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const percent = Math.max(0, Math.min(offsetX / rect.width, 1));
            const clamped = clampTime(percent * rawDuration);
            audio.currentTime = clamped;
          }
          setDragging(false);
        }
      },
      [dragging, rawDuration, startTime, endTime]
    );

    const togglePlay = () => {
      const audio = audioRef.current;
      if (!audio || invalidSegment) return;

      if (audio.paused) {
        registerAudio(audio, () => {
          audio.pause();
          setIsPlaying(false);
        });

        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            if (err.name !== "AbortError")
              console.error("Audio play error:", err);
          });
      } else {
        audio.pause();
        setIsPlaying(false);
        clearAudio(audio);
      }
    };

    useEffect(() => {
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setDuration(formatTime(audio.duration));
        setRawDuration(audio.duration);

        if (startTime !== null && Number.isFinite(startTime)) {
          audio.currentTime = startTime;
        }
      };

      const handleTimeUpdate = () => {
        if (audio.duration && !dragging) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging, startTime, handleMouseMove, handleMouseUp]);

    // 👇 Stop playback once endTime is reached
    useEffect(() => {
      const audio = audioRef.current;
      let interval = null;

      if (isPlaying && audio && endTime !== null && Number.isFinite(endTime)) {
        interval = setInterval(() => {
          if (audio.currentTime >= endTime) {
            audio.pause();
            setIsPlaying(false);
            currentlyPlayingAudio = null;
          }
        }, 100);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isPlaying, endTime]);

    useEffect(() => {
      const audio = audioRef.current;

      const handleEnded = () => {
        setIsPlaying(false);
        currentlyPlayingAudio = null;
        trackAudioEvent("completed");
        clearAudio(audio);
      };

      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }, []);

    useEffect(() => {
      const unsubscribe = subscribe((otherId) => {
        if (
          (otherId !== uniqueId.current && isPlaying) ||
          otherId === "PAUSE_ALL"
        ) {
          audioRef.current.pause();
          setIsPlaying(false);
          trackAudioEvent("paused");
        }
      });

      return unsubscribe;
    }, [isPlaying, trackAudioEvent]);

    useEffect(() => {
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (audioRef.current) {
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              if (err.name !== "AbortError") {
                console.error("Audio play error:", err);
              }
            });
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      },
    }));

    return (
      <div className="w-full flex items-center justify-center">
        <div
          className={`w-full bg-slate-100 pr-2 rounded-md flex items-center relative ${className}`}
        >
          {/* Play / Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={togglePlay}
            disabled={invalidSegment}
            title={invalidSegment ? "Invalid start or end time" : ""}
          >
            {isPlaying ? (
              <FaPause className="h-4 w-4" />
            ) : (
              <FaPlay className="h-4 w-4" />
            )}
          </Button>

          {/* Progress Bar */}
          {showProgressBar && (
            <div
              className="h-1.5 flex-1 bg-slate-200 rounded-full relative cursor-pointer mr-2"
              ref={progressBarRef}
              onMouseDown={handleMouseDown}
            >
              <div
                className="h-1.5 bg-blue-500 rounded-full absolute top-0 left-0"
                style={{ width: `${progress}%` }}
              />
              {dragging && (
                <div
                  className="absolute -top-8 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded"
                  style={{ left: `${hoverX}px` }}
                >
                  {tooltipTime}
                </div>
              )}
            </div>
          )}

          {/* Duration Display */}
          {showDuration ? (
            <span className="text-xs text-slate-600 font-medium">
              {duration}
            </span>
          ) : null}

          {showCustomDuration ? (
            <span className="text-xs text-slate-600 font-medium">
              {showCustomDuration}
            </span>
          ) : null}

          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={url}
            preload="metadata"
            onLoadedMetadata={onLoadedMetadata}
          />
        </div>
      </div>
    );
  }
);

export default AudioPlayer;
