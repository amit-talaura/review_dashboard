import React, { useMemo } from "react";

const classNames = (...c) => c.filter(Boolean).join(" ");

function Pagination({ page, total, limit, onPageChange }) {
  const pageCount = Math.ceil(total / limit);

  const pages = useMemo(() => {
    if (pageCount <= 1) return [1];

    const items = new Set([
      1,
      page,
      page - 1,
      page + 1,
      page - 2,
      page + 2,
      pageCount,
    ]);

    if (pageCount > 9) {
      const mid = Math.round((pageCount * 2) / 3); // 2/3 point
      items.add(mid);
    }

    const sorted = [...items]
      .filter((p) => p >= 1 && p <= pageCount)
      .sort((a, b) => a - b);

    const withEllipses = [];
    for (let i = 0; i < sorted.length; i++) {
      const curr = sorted[i];
      const prev = sorted[i - 1];
      if (prev && curr - prev > 1) withEllipses.push("…");
      withEllipses.push(curr);
    }
    return withEllipses;
  }, [page, pageCount]);

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2 text-sm"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md p-2 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        ‹
      </button>

      {pages.map((p, idx) =>
        p === "…" ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={classNames(
              "min-w-8 rounded-md px-2 py-1.5",
              p === page
                ? "bg-indigo-50 text-blue ring-1 ring-blue-600"
                : "text-slate-700 hover:bg-slate-50 ring-1 ring-transparent"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="rounded-md p-2 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}

export default Pagination;
