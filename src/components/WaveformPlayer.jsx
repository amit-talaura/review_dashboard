/* eslint-disable no-unused-vars */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import DotLoader from "./ui/DotLoader";
import { clearAudio, registerAudio } from "../utils/audioManager";
import { useDispatch } from "react-redux";
import play from "../assets/icons/play.png";
import pause from "../assets/icons/pause.png";

const WaveformPlayer = forwardRef(
  (
    {
      src,
      subAudioStartPoint,
      subAudioEndPoint,
      autoPlayOnLoad = false,
      height,
      isPlaying: isSegmentPlaying,
      setIsPlaying: setIsSegmentPlaying,
      setPlayingIndex,
      className,
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const regionsPlugin = useRef(null);
    const segmentTimeoutRef = useRef(null);
    const rafRef = useRef(null);
    const activeRegionIdRef = useRef(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // 🕒 Format time
    const formatTime = useCallback((seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }, []);

    // 🔧 helpers
    const clearSegmentTimeout = () => {
      if (segmentTimeoutRef.current) {
        clearTimeout(segmentTimeoutRef.current);
        segmentTimeoutRef.current = null;
      }
    };

    const removeExistingRegion = () => {
      if (!regionsPlugin.current) return;
      const regs = regionsPlugin.current.getRegions?.() || [];
      regs.forEach((r) => r.remove());
      activeRegionIdRef.current = null;
    };

    const clampTimes = (start, end) => {
      const total = wavesurfer.current?.getDuration() ?? 0;
      const s = Math.max(0, Math.min(start ?? 0, total));
      const e =
        typeof end === "number" && end > s ? Math.min(end, total) : total;
      return { s, e, total };
    };

    const createRegion = (start, end) => {
      if (!regionsPlugin.current || !wavesurfer.current) return null;
      removeExistingRegion();
      const region = regionsPlugin.current.addRegion({
        start,
        end,
        drag: false,
        resize: false,
        color: "rgba(255, 0, 0, 0.4)",
      });
      activeRegionIdRef.current = region?.id ?? null;
      return region;
    };

    const playSegmentInternal = (start, end) => {
      if (!wavesurfer.current) return;
      clearSegmentTimeout();
      removeExistingRegion();

      const { s, e, total } = clampTimes(start, end);

      // Add the region visually
      createRegion(s, e);

      // Seek and play within the window
      wavesurfer.current.seekTo(s / total);
      registerAudio(wavesurfer.current, pauseAudio);
      wavesurfer.current.play();
      setIsPlaying(true);

      // Stop at end
      clearSegmentTimeout();
      segmentTimeoutRef.current = setTimeout(() => {
        pauseAudio();
      }, (e - s) * 1000);
    };

    // 🎵 Setup WaveSurfer once
    useEffect(() => {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#99bff9",
        progressColor: "#0060F0",
        barWidth: 2,
        height: height,
        responsive: true,
        cursorWidth: 1,
        cursorColor: "#ff5500",
        interact: true,
      });

      regionsPlugin.current = wavesurfer.current.registerPlugin(
        RegionsPlugin.create()
      );

      // cleanup
      return () => {
        if (wavesurfer.current) {
          wavesurfer.current.unAll();
          wavesurfer.current.destroy();
        }
        clearSegmentTimeout();
        cancelAnimationFrame(rafRef.current);
      };
    }, []);

    useEffect(() => {
      if (!src || !wavesurfer.current) return;

      setIsLoading(true);
      wavesurfer.current.load(src);

      const handleReady = () => {
        setIsLoading(false);
        setDuration(wavesurfer.current.getDuration());
        if (autoPlayOnLoad) {
          if (
            typeof subAudioStartPoint === "number" &&
            typeof subAudioEndPoint === "number"
          ) {
            // play the region immediately when ready
            playSegmentInternal(subAudioStartPoint, subAudioEndPoint);
          } else {
            togglePlayPause();
          }
        }
      };

      const updateProgress = () => {
        if (wavesurfer.current?.isPlaying()) {
          setCurrentTime(wavesurfer.current.getCurrentTime());
          rafRef.current = requestAnimationFrame(updateProgress);
        }
      };

      const handlePause = () => {
        cancelAnimationFrame(rafRef.current);
        clearSegmentTimeout();
      };

      const handleFinish = () => {
        setIsPlaying(false);
        clearAudio(wavesurfer.current);
        clearSegmentTimeout();
        removeExistingRegion();
        setPlayingIndex(null);
      };

      wavesurfer.current.on("ready", handleReady);
      wavesurfer.current.on("play", updateProgress);
      wavesurfer.current.on("pause", handlePause);
      wavesurfer.current.on("finish", handleFinish);

      return () => {
        wavesurfer.current.un("ready", handleReady);
        wavesurfer.current.un("play", updateProgress);
        wavesurfer.current.un("pause", handlePause);
        wavesurfer.current.un("finish", handleFinish);
      };
    }, [src]);

    const pauseAudio = useCallback(() => {
      if (!wavesurfer.current) return;
      wavesurfer.current.pause();
      setIsPlaying(false);
      if (isSegmentPlaying) {
        setIsSegmentPlaying(false);
      }
      clearAudio(wavesurfer.current);
      clearSegmentTimeout();
    }, [isSegmentPlaying]);

    const togglePlayPause = () => {
      if (!wavesurfer.current) return;

      // If timestamps are provided, always (re)create the region and play that slice
      const hasSlice =
        typeof subAudioStartPoint === "number" &&
        typeof subAudioEndPoint === "number";

      if (wavesurfer.current.isPlaying()) {
        pauseAudio();
        setPlayingIndex(null);
        return;
      }

      if (hasSlice) {
        playSegmentInternal(subAudioStartPoint, subAudioEndPoint);
      } else {
        // Fallback: normal full-audio play
        registerAudio(wavesurfer.current, pauseAudio);
        wavesurfer.current.play();
        setIsPlaying(true);
      }
    };

    useImperativeHandle(ref, () => ({
      // keeps backward-compat with your existing call-site
      playSegment: (start, end) => {
        playSegmentInternal(start, end);
      },
      // new explicit API the parent is using
      addRegionAndPlayIt: (start, end) => {
        playSegmentInternal(start, end);
      },
      removeRegion: () => {
        regionsPlugin.current.destroy();
      },
      play: () => {
        if (wavesurfer.current) {
          // honor slice if provided via props
          if (
            typeof subAudioStartPoint === "number" &&
            typeof subAudioEndPoint === "number"
          ) {
            playSegmentInternal(subAudioStartPoint, subAudioEndPoint);
          } else {
            registerAudio(wavesurfer.current, pauseAudio);
            wavesurfer.current.play();
            setIsPlaying(true);
          }
        }
      },
      pause: pauseAudio,
    }));

    return (
      <div
        className={`overflow-hidden mx-auto w-full my-2 flex justify-center items-center ${className}`}
      >
        <button className="w-auto p-1 mb-5" onClick={togglePlayPause}>
          <img
            src={isPlaying ? pause : play}
            alt="icon"
            className={`w-4 h-4 object-cover mt-2 ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />
        </button>

        <div className="flex flex-col justify-center items-center w-full">
          <div className="border border-gray-300 rounded-md overflow-hidden w-full relative">
            <div
              ref={waveformRef}
              className={`w-full transition-opacity ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
            />
            {isLoading && (
              <div className="absolute inset-0 flex justify-center items-center z-20">
                <DotLoader />
              </div>
            )}
          </div>

          <div className="text-sm text-gray-700 w-full flex justify-between items-center">
            <p className="text-[10px]">{formatTime(currentTime)}</p>
            <p className="text-[10px]">{formatTime(duration)}</p>
          </div>
        </div>
      </div>
    );
  }
);

export default WaveformPlayer;
