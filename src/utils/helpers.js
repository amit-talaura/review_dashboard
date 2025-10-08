import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (file) => {
  const BUCKET_NAME = "talaura-docker-bucket";
  const KEY = `uploads/${Date.now()}_${file.name}`;
  const arrayBuffer = await file.arrayBuffer();
  const params = {
    Bucket: BUCKET_NAME,
    Key: KEY,
    Body: arrayBuffer,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    const url = `s3://${BUCKET_NAME}/${KEY}`;

    return url;
  } catch (err) {
    console.error("Upload failed:", err);
    return null;
  }
};

export function formatToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const formatTODDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMins = String(mins).padStart(2, "0");
  const paddedSecs = String(secs).padStart(2, "0");

  return `${paddedMins}:${paddedSecs}`;
};

export function formatDate(dateInput) {
  const date = new Date(dateInput);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}

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

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const intoSeconds = (seconds) => {
  seconds = Math.floor(seconds);

  if (!Number.isFinite(seconds)) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export const toSeconds = (val) => {
  const num = Number(val);
  return Number.isFinite(num) ? num : null; // returns number or null
};

let currentAudio = null;
let currentStopFn = null;

export const registerAudio = (audioInstance, stopFn) => {
  if (currentAudio && currentAudio !== audioInstance) {
    if (currentStopFn) currentStopFn();
  }
  currentAudio = audioInstance;
  currentStopFn = stopFn;
};

export const clearAudio = (audioInstance) => {
  if (currentAudio === audioInstance) {
    currentAudio = null;
    currentStopFn = null;
  }
};

export const pauseAllAudios = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch (err) {
      console.warn("Error stopping audio:", err);
    }
    if (currentStopFn) currentStopFn();
    currentAudio = null;
    currentStopFn = null;
  }
};
