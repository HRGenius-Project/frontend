import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Server,
  FileText,
  Activity,
  LogOut,
  X,
  ExternalLink,
  Clock,
  Eye,
} from "lucide-react";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  currentUser,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

const navItems = [
    {
      id: "users",
      label: "User Governance",
      icon: <Users className="w-4 h-4" />,
      desc: "Accounts & Privileges",
    },
    {
      id: "hr_audit",
      label: "HR Operations Log",
      icon: <Activity className="w-4 h-4" />,
      desc: "Onboarding & HR Actions",
    },
    {
      id: "attendance",
      label: "Live Attendance",
      icon: <Clock className="w-4 h-4" />,
      desc: "Punches & Daily Roster",
    },
    {
      id: "employee_watch",
      label: "Employee Activity",
      icon: <Eye className="w-4 h-4" />,
      desc: "Portal Actions & Events",
    },
    {
      id: "services",
      label: "System Telemetry",
      icon: <Server className="w-4 h-4" />,
      desc: "Services & Nodes Health",
    },
    {
      id: "audit",
      label: "Security Audit Logs",
      icon: <FileText className="w-4 h-4" />,
      desc: "Access & Event Trail",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Permanently Fixed Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#061B33] text-white flex flex-col justify-between p-6 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto no-scrollbar">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FF3B30] text-lg font-black text-white shadow-sm">
                H
              </span>
              <span className="text-xl font-black tracking-tight text-white">
                HR<span className="text-[#FF3B30]">GENIUS</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Root Privilege Badge */}
          <div className="mt-4 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-[#FB9A1E] flex items-center gap-2 shrink-0">
            <Shield className="w-3.5 h-3.5 text-[#FB9A1E]" />
            <span>ROOT_ADMIN ACCESS</span>
          </div>

          {/* Navigation Items (The 3 Options) */}
          <nav className="mt-6 space-y-1.5 flex-1">
            <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Admin Controls
            </p>
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left transition-all ${
                    active
                      ? "bg-[#FB9A1E] text-slate-950 font-black shadow-md shadow-[#FB9A1E]/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-xs"
                  }`}
                >
                  <div className={active ? "text-slate-950" : "text-slate-400"}>
                    {item.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs truncate">{item.label}</p>
                    <p
                      className={`text-[9px] truncate ${
                        active ? "text-slate-800" : "text-slate-500"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Quick Portals Switch */}
            <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
              <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Switch Workspaces
              </p>
              <button
                onClick={() => navigate("/hr/dashboard")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-3.5 h-3.5" />
                  <span>HR Operations</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          </nav>
        </div>

        {/* User Card & Logout Bottom */}
        <div className="pt-4 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#FF3B30] text-white font-black flex items-center justify-center text-xs shrink-0">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-white truncate">
                  {currentUser.sub || "Admin"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser.email || "admin@hrgenius.com"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-[#FF5740] transition-colors p-1.5 rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}