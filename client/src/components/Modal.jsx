import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center bg-zinc-500/95 z-50"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="flex justify-center flex-col  bg-[#F9F6F3] p-6 rounded shadow-lg"
      >
        {children}
      </div>
    </div>
  );
}
