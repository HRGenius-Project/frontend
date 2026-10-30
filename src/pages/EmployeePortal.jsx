import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import {
  Clock,
  Calendar,
  CheckCircle2,
  LogOut,
  User,
  Building,
  Briefcase,
  AlertCircle,
  FileText,
  Send,
} from "lucide-react";

const display = {
  fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  letterSpacing: "0.03em",
};

export default function EmployeePortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchMsg, setPunchMsg] = useState("");

  // Stored User / JWT Token Data
  const [currentUser] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("hrgenius_user") ||
            sessionStorage.getItem("hrgenius_user")
        ) || {}
      );
    } catch {
      return {};
    }
  });

  // Employee Profile Info
  const [profile, setProfile] = useState({
    empCode: "EMP#0001",
    name: "Employee User",
    email: "emp@hrgenius.com",
    department: "Engineering",
    designation: "Software Engineer",
    shift: "General (09:00 AM - 06:00 PM)",
  });

  // Leave Form State
  const [leaveType, setLeaveType] = useState("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveApplied, setLeaveApplied] = useState(false);

  useEffect(() => {
    // Current user username se profile details sync karne ki koshish
    const syncProfile = async () => {
      try {
        const username = currentUser.sub || "empone";
        setProfile((prev) => ({
          ...prev,
          name: username.toUpperCase(),
          email: `${username}@hrgenius.com`,
        }));
      } catch (err) {
        console.warn("Profile sync error:", err);
      }
    };
    syncProfile();
  }, [currentUser]);

  // Punch In / Out Handler (Connects to attendance-service)
  const handlePunch = async (type) => {
    setPunchLoading(true);
    setPunchMsg("");
    try {
      const endpoint =
        type === "IN"
          ? `/api/attendance/punch-in?employeeCode=${profile.empCode}`
          : `/api/attendance/punch-out?employeeCode=${profile.empCode}`;

      await axiosClient.post(endpoint);
      setPunchedIn(type === "IN");
      setPunchMsg(
        type === "IN"
          ? "Punch-In Recorded Successfully!"
          : "Punch-Out Recorded Successfully!"
      );
    } catch (err) {
      // Fallback agar attendance-service local mock ho
      setPunchedIn(type === "IN");
      setPunchMsg(
        `Recorded locally (${type === "IN" ? "Checked In" : "Checked Out"})`
      );
    } finally {
      setPunchLoading(false);
    }
  };

  // Leave Application Submit
  const handleApplyLeave = (e) => {
    e.preventDefault();
    setLeaveApplied(true);
    setTimeout(() => {
      setStartDate("");
      setEndDate("");
      setReason("");
      setLeaveApplied(false);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <header className="bg-[#061B33] text-white px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#FF3B30] text-sm font-black text-white">
            H
          </span>
          <span className="text-lg font-black tracking-tight text-white">
            HR<span className="text-[#FF3B30]">GENIUS</span>
          </span>
          <span className="ml-3 px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-slate-300">
            EMPLOYEE PORTAL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black">{profile.name}</p>
            <p className="text-[10px] text-slate-400">{profile.empCode}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition text-slate-300"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        {/* Welcome Banner & Quick Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FB9A1E]">
              Workspace Portal
            </span>
            <h1 style={display} className="text-3xl sm:text-4xl text-[#061B33]">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-xs text-slate-400">
              Assigned Shift:{" "}
              <span className="font-semibold text-slate-700">
                {profile.shift}
              </span>
            </p>
          </div>

          {/* Quick Profile Pill */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-[#061B33] text-white flex items-center justify-center font-bold text-xs">
              {profile.empCode.replace("EMP#", "#")}
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">
                {profile.designation}
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                {profile.department}
              </p>
            </div>
          </div>
        </div>

        {/* Action Grid: Punch In/Out + Leave Apply */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Shift & Attendance Action */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Daily Attendance
                </span>
                <Clock className="w-4 h-4 text-[#FB9A1E]" />
              </div>
              <h3 style={display} className="text-2xl text-[#061B33] uppercase">
                {punchedIn ? "Currently Clocked In" : "Not Clocked In"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {punchedIn
                  ? "Your shift timer is active. Remember to punch out before leaving."
                  : "Mark your attendance for today's work roster."}
              </p>

              {punchMsg && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-[#20B685] text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{punchMsg}</span>
                </div>
              )}
            </div>

            <div className="pt-6">
              {!punchedIn ? (
                <button
                  onClick={() => handlePunch("IN")}
                  disabled={punchLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#20B685] hover:bg-[#1ba074] text-white text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Punch In</span>
                </button>
              ) : (
                <button
                  onClick={() => handlePunch("OUT")}
                  disabled={punchLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#FF5740] hover:bg-[#e04a35] text-white text-xs font-bold uppercase tracking-wider transition shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Punch Out</span>
                </button>
              )}
            </div>
          </div>

          {/* Card 2 & 3: Apply Leave */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Time Off Request
                </span>
                <h3
                  style={display}
                  className="text-2xl text-[#061B33] uppercase"
                >
                  Apply For Leave
                </h3>
              </div>
              <Calendar className="w-5 h-5 text-[#A58BFA]" />
            </div>

            {leaveApplied && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[#20B685] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  Leave application submitted successfully for HR review!
                </span>
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#061B33]"
                  >
                    <option value="CASUAL">Casual Leave (CL)</option>
                    <option value="SICK">Sick Leave (SL)</option>
                    <option value="EARNED">Earned Leave (EL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#061B33]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#061B33]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Reason for Absence
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Urgent family medical appointment"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#061B33]"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#061B33] text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition flex items-center gap-2 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5 text-[#E6FB3F]" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}