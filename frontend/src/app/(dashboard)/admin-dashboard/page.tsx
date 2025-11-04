"use client";

import { useEffect, useState } from "react";
import DashboardTabs from "@/components/default/DashboardTabs";
import MovieTab from "@/components/default/MovieTab";
import PriceTab from "@/components/default/PriceTab";
import UsersTab from "@/components/default/UsersTab";



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");

  return (
    <div className="p-6 bg-gray-700 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 bg-gray-90 p-4">
        {activeTab === "movies" && <MovieTab />}
        {activeTab === "prices" && <PriceTab />}
        {activeTab === "users" && <UsersTab />}
      </div>
    </div>
  );
}
