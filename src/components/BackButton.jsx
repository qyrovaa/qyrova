import React from "react";

export default function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
      absolute top-6 left-6 z-50
      text-white text-3xl
      opacity-90
      hover:opacity-100
      hover:-translate-x-1
      hover:scale-110
      hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]
      transition-all duration-300
      "
    >
      ←
    </button>
  );
}