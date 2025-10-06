import { useEffect, useRef, useState } from "react";

const classNames = (...c) => c.filter(Boolean).join(" ");

const StatusChevron = ({ open }) => (
  <svg
    className={classNames(
      "h-4 w-4 transition-transform",
      open ? "rotate-180" : "rotate-0"
    )}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
      clipRule="evenodd"
    />
  </svg>
);

function StatusMenu({ value }) {
  const statusRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClose = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    window.addEventListener("click", handleClose);

    return () => window.removeEventListener("click", handleClose);
  }, []);

  return (
    <div className="relative inline-flex" ref={statusRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={(e) => {
          if (!e.currentTarget.parentElement.contains(e.relatedTarget))
            setOpen(false);
        }}
        className={classNames(
          "inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Status: ${value}`}
      >
        {value.charAt(0).toUpperCase() +
          value.substring(1, value.length)?.toLowerCase()}
        <StatusChevron open={open} />
      </button>

      {open && (
        <ul
          tabIndex={-1}
          role="listbox"
          className="absolute z-10 mt-1 w-36 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg focus:outline-none"
        >
          {["Active", "Inactive"].map((opt) => (
            <li key={opt}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt}
                disabled
                className={classNames(
                  "block w-full px-3 py-2 text-left text-sm cursor-not-allowed opacity-50",
                  value === opt
                    ? "font-semibold text-slate-900"
                    : "text-slate-700"
                )}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StatusMenu;
