"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type PriceInfoRow = { label: string; value: string; strong?: boolean };

type PriceInfoProps = {
  title?: string;
  rows?: PriceInfoRow[];
  note?: string;
  className?: string;
};

const fmt = (v: string | number | null | undefined) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "number") return `AED ${v}`;
  return /\d/.test(v) ? `AED ${v.trim()}` : v;
};

/** Breakdown rows for a service: regular vs member price and the saving. */
export function servicePriceRows(service: {
  normal_price?: string | number | null;
  member_price?: string | number | null;
}): PriceInfoRow[] {
  const normal = parseFloat(String(service.normal_price));
  const member = parseFloat(String(service.member_price));
  const rows: PriceInfoRow[] = [
    { label: "Regular price", value: fmt(service.normal_price) },
    { label: "Member price", value: fmt(service.member_price) },
  ];
  if (!isNaN(normal) && !isNaN(member) && normal > member) {
    rows.push({ label: "You save as a member", value: `AED ${+(normal - member).toFixed(2)}`, strong: true });
  }
  return rows;
}

const TOOLTIP_WIDTH = 256;
const GAP = 8;

/**
 * Small "i" icon that reveals a pricing breakdown on hover / focus / tap.
 * The tooltip is position: fixed so it is never clipped by overflow-hidden cards.
 * Rendered as a span (not a button) so it can sit inside other buttons.
 */
export default function PriceInfo({ title = "Price breakdown", rows = [], note, className = "" }: PriceInfoProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2),
      window.innerWidth - TOOLTIP_WIDTH - 8
    );
    setPos({ top: rect.bottom + GAP, left });
  }, []);

  const show = useCallback(() => {
    place();
    setOpen(true);
  }, [place]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const onDocClick = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onDocClick);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onDocClick);
    };
  }, [open]);

  return (
    <span
      ref={triggerRef}
      role="button"
      tabIndex={0}
      aria-label={title}
      aria-describedby={open ? id : undefined}
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
      onFocus={show}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        open ? setOpen(false) : show();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          open ? setOpen(false) : show();
        }
      }}
      className={`inline-flex items-center justify-center align-middle shrink-0 w-4 h-4 rounded-full border border-current text-[10px] leading-none font-semibold italic font-serif opacity-50 hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-help select-none ${className}`}
    >
      i
      {open &&
        createPortal(
        <span
          id={id}
          role="tooltip"
          style={{ position: "fixed", top: pos.top, left: pos.left, width: TOOLTIP_WIDTH }}
          className="z-[100] not-italic font-sans text-left normal-case tracking-normal rounded-xl border border-white/15 bg-[#0a0f1f] p-3.5 shadow-2xl shadow-black/60 pointer-events-none"
        >
          <span className="block text-white text-xs font-semibold mb-2">{title}</span>
          {rows.map((row, i) => (
            <span
              key={i}
              className={`flex justify-between gap-3 text-[11px] leading-5 ${
                row.strong ? "text-white font-semibold border-t border-white/10 mt-1 pt-1" : "text-white/70 font-normal"
              }`}
            >
              <span>{row.label}</span>
              <span className="text-right">{row.value}</span>
            </span>
          ))}
          {note && <span className="block text-white/50 text-[11px] font-normal leading-4 mt-2">{note}</span>}
        </span>,
        document.body
      )}
    </span>
  );
}
