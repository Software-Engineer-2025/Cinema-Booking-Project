"use client";

import {use, useEffect, useState} from "react";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import MovieTab from "@/components/dashboard/MovieTab";
import PriceTab from "@/components/dashboard/PriceTab";
import UsersTab from "@/components/dashboard/UsersTab";
import {useAuth} from "@/lib/context/AuthContext";
import {redirect} from "next/navigation";



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("movies");
  const {user, admin, isLoading} = useAuth();

  if (isLoading) {
      return <p>Loading...</p>;
  }

  if (!user && !admin) {
      redirect('/login');
      return null;
  }

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
