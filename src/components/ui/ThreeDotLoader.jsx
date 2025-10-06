import React from "react";

export default function ThreeDotLoader({
  size = 3,
  color = "bg-gray-600",
  gap = "gap-1",
  speed = 300,
  inline = true,
  dotCount = 3,
  className = "",
  ariaLabel = "Loading...",
}) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={`${
        inline ? "inline-flex" : "flex"
      } items-center ${gap} ${className}`}
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <span
          key={i}
          className={`${color} rounded-full`}
          style={{
            width: `${size * 0.25}rem`,
            height: `${size * 0.25}rem`,
            animation: `dot-bounce ${speed}ms ease-in-out infinite`,
            animationDelay: `${(i * speed) / dotCount}ms`,
          }}
        />
      ))}
    </span>
  );
}
