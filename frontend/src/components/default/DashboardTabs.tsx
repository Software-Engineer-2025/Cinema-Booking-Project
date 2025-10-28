"use client";

import { useState, useEffect } from "react";

export default function DashboardTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "movies", label: "Movies" },
    { id: "prices", label: "Price & Promos" },
    { id: "users", label: "Users" },
  ];

  return (
    <div className="flex space-x-4 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-4 text-lg font-medium border-b-2 transition ${
            activeTab === tab.id
              ? "border-white text-white"
              : "border-transparent text-white-100 hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
