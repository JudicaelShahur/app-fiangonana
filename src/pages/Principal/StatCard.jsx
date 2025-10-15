import React from "react";

const StatCard = ({ title, value, change, icon }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      {change && (
        <span className={`stat-change ${change >= 0 ? "positive" : "negative"}`}>
          {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

export default StatCard;
