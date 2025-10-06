import React from "react";

export default function Spinner({
  size = 32,
  color = "#1868db",
  trackColor = "rgba(0,0,0,0.1)",
  strokeWidth = 2,
  speed = "0.8s",
  className = "",
}) {
  const pxSize = typeof size === "number" ? `${size}px` : size;
  const vb = 32; // viewBox
  const r = vb / 2 - strokeWidth / 2;
  const circumference = Math.PI * r;

  return (
    <span
      className={className}
      style={{ display: "inline-flex", width: pxSize, height: pxSize }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${vb} ${vb}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Track */}
        <circle
          cx={vb / 2}
          cy={vb / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Rotating Arc */}
        <circle
          cx={vb / 2}
          cy={vb / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${vb / 2} ${vb / 2}`}
            to={`360 ${vb / 2} ${vb / 2}`}
            dur={speed}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
  );
}
