import React from "react";
import { Eye, ShieldAlert, Send, Clock, CheckCircle } from "lucide-react";

const display = {
  fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  letterSpacing: "0.03em",
};

export default function EmployeeActivityWatch() {
  const activities = [
    {
      id: 1,
      emp: "EMP0001 (Rahul Sharma)",
      action: "PUNCH_IN",
      detail: "Triggered shift start from IP 192.168.1.45",
      time: "09:02 AM",
      risk: "NORMAL"
    },
    {
      id: 2,
      emp: "EMP0002 (Vikas Mehta)",
      action: "LEAVE_APPLY",
      detail: "Applied for 1-day Casual Leave (Personal Emergency)",
      time: "10:15 AM",
      risk: "NORMAL"
    },
    {
      id: 3,
      emp: "EMP0002 (Vikas Mehta)",
      action: "LOGIN_REJECTED",
      detail: "Attempted login while account was marked LOCKED by Admin",
      time: "11:20 AM",
      risk: "SECURITY_EVENT"
    },
    {
      id: 4,
      emp: "EMP0003 (Priyanshu Kumar)",
      action: "PASSWORD_CHANGED",
      detail: "Updated initial temporary password via /change-password",
      time: "02:10 PM",
      risk: "NORMAL"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 style={display} className="text-2xl text-[#061B33] uppercase">
            Employee Activity Watchtower
          </h3>
          <p className="text-xs text-slate-400 font-medium">
            Surveillance of employee portal triggers, punch locations, and security anomalies.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
          <Eye className="w-3.5 h-3.5" />
          <span>Active Observer</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">
                <th className="pb-3">Subject Employee</th>
                <th className="pb-3">Action Signature</th>
                <th className="pb-3">Activity Description</th>
                <th className="pb-3">Event Time</th>
                <th className="pb-3 text-right">Risk Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {activities.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-bold text-slate-900">{act.emp}</td>
                  <td className="py-3">
                    <span className="font-mono font-bold text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {act.action}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600">{act.detail}</td>
                  <td className="py-3 font-mono text-slate-400 text-[11px]">{act.time}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      act.risk === "SECURITY_EVENT"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {act.risk}
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