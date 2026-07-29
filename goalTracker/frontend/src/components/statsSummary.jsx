import React from "react";

export default function StatsSummary({ tasks }) {
  if (!tasks || tasks.length === 0) return <p>No tasks yet</p>;

  // Total units and completed units
  const total = tasks.reduce((acc, t) => acc + (t.totalSteps ?? 0), 0);
  const completed = tasks.reduce((acc, t) => acc + (t.completedSteps ?? 0), 0);

  // Completion percentage
  const percentage = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

  return (
    <div className="stats-summary">
      <h2>Overall Progress</h2>
      <p>
        Completed {completed} of {total} total units
      </p>
      <div className="overall-progress-bar" style={{ height: 20, background: "#eee", borderRadius: 8 }}>
        <div
          className="fill"
          style={{
            width: `${percentage}%`,
            background: "#4caf50",
            height: "100%",
            borderRadius: 8,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <p style={{ fontWeight: "bold", marginTop: 8 }}>{Math.round(percentage)}%</p>
    </div>
  );
}

