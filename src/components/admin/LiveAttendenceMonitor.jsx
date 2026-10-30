import React, { useState } from "react";
import { Clock, CheckCircle2, XCircle, AlertTriangle, User, Calendar } from "lucide-react";

const display = {
  fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  letterSpacing: "0.03em",
};

export default function LiveAttendanceMonitor() {
  const [filter, setFilter] = useState("ALL");

  // Real-time Punch Records
  const [punches] = useState([
    {
      id: 1,
      empCode: "EMP0001",
      name: "Rahul Sharma",
      department: "Engineering",
      shift: "General (09:00 - 18:00)",
      punchIn: "09:02 AM",
      punchOut: "--",
      status: "PRESENT",
      late: false
    },
    {
      id: 2,
      empCode: "EMP0002",
      name: "Vikas Mehta",
      department: "Product",
      shift: "General (09:00 - 18:00)",
      punchIn: "09:41 AM",
      punchOut: "--",
      status: "PRESENT",
      late: true
    },
    {
      id: 3,
      empCode: "EMP0003",
      name: "Priyanshu Kumar",
      department: "Engineering",
      shift: "General (09:00 - 18:00)",
      punchIn: "--",
      punchOut: "--",
      status: "ABSENT",
      late: false
    },
    {
      id: 4,
      empCode: "EMP0014",
      name: "Pooja Hegde",
      department: "Human Resources",
      shift: "General (09:00 - 18:00)",
      punchIn: "08:55 AM",
      punchOut: "06:05 PM",
      status: "COMPLETED",
      late: false
    }
  ]);

  const filtered = punches.filter((p) => {
    if (filter === "PRESENT") return p.status === "PRESENT" || p.status === "COMPLETED";
    if (filter === "ABSENT") return p.status === "ABSENT";
    if (filter === "LATE") return p.late;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 style={display} className="text-2xl text-[#061B33] uppercase">
          Live Attendance & Punch Monitor
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          Real-time daily punch telemetry linked to attendance-service.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Shift Expected</p>
          <span style={display} className="text-3xl text-[#061B33]">4</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-[#20B685] uppercase">Clocked In Now</p>
          <span style={display} className="text-3xl text-[#20B685]">2</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-amber-500 uppercase">Late Arrivals</p>
          <span style={display} className="text-3xl text-amber-500">1</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-[#FF5740] uppercase">Not Reported</p>
          <span style={display} className="text-3xl text-[#FF5740]">1</span>
        </div>
      </div>

      {/* Punch Records Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["ALL", "PRESENT", "ABSENT", "LATE"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === tab
                    ? "bg-[#061B33] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Date: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">
                <th className="pb-3">Employee</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Assigned Shift</th>
                <th className="pb-3">Punch-In</th>
                <th className="pb-3">Punch-Out</th>
                <th className="pb-3 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{item.empCode}</span>
                  </td>
                  <td className="py-3 text-slate-600">{item.department}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{item.shift}</td>
                  <td className="py-3 font-mono font-bold text-slate-800">
                    {item.punchIn}{" "}
                    {item.late && (
                      <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-800 font-sans">
                        Late
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-mono text-slate-600">{item.punchOut}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      item.status === "PRESENT"
                        ? "bg-[#20B685]/15 text-[#20B685]"
                        : item.status === "COMPLETED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}