import React from "react";
import { Search, RefreshCw, Bell, Menu } from "lucide-react";

const display = {
  fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  letterSpacing: "0.03em",
};

export default function AdminHeader({
  searchQuery,
  setSearchQuery,
  fetchAdminData,
  loading,
  setIsMobileOpen
}) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1
            style={display}
            className="text-2xl sm:text-3xl uppercase tracking-tight text-[#061B33]"
          >
            System Administration
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block">
            Manage security accounts, role assignments, and gateway governance.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Responsive Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#061B33] transition-all w-32 sm:w-60"
          />
        </div>

        <button
          onClick={fetchAdminData}
          title="Refresh Data"
          className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>

        <button className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#20B685] absolute top-2 right-2"></span>
        </button>
      </div>
    </header>
  );
}