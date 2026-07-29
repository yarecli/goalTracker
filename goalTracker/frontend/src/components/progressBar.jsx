import React from "react";

export default function ProgressBar({ percentage }) {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar-fill"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
      <span className="progress-bar-text">{Math.round(percentage)}%</span>
    </div>
  );
}
