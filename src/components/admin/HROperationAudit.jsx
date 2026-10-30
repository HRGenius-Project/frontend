import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { UserCheck, CalendarCheck, Clock, FileSpreadsheet, AlertCircle } from "lucide-react";

const display = {
  fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  letterSpacing: "0.03em",
};

export default function HROperationsAudit() {
  const [onboardedList, setOnboardedList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock HR Leave Decision Records
  const [hrActions] = useState([
    {
      id: "HRA-109",
      hrName: "hrone",
      actionType: "LEAVE_APPROVAL",
      target: "Rohan Verma (EMP#0012)",
      detail: "Approved 2 Days Sick Leave",
      timestamp: "Today, 11:45 AM",
      status: "APPROVED"
    },
    {
      id: "HRA-108",
      hrName: "hrone",
      actionType: "LEAVE_REJECTION",
      target: "Vikram Malhotra (EMP#0089)",
      detail: "Rejected Earned Leave (Staff Shortage)",
      timestamp: "Yesterday, 04:30 PM",
      status: "REJECTED"
    },
    {
      id: "HRA-107",
      hrName: "hrone",
      actionType: "ONBOARDING_COMMIT",
      target: "Priyanshu Kumar (EMP0003)",
      detail: "Created Engineering profile & CTC setup",
      timestamp: "Yesterday, 02:15 PM",
      status: "COMPLETED"
    }
  ]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/api/employees");
        if (res.data && Array.isArray(res.data)) {
          setOnboardedList(res.data);
        }
      } catch (err) {
        console.warn("Failed to load employee list for HR audit:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 style={display} className="text-2xl text-[#061B33] uppercase">
          HR Management Audit Trail
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          Comprehensive log of HR personnel onboarding records, salary setups, and leave resolutions.
        </p>
      </div>

      {/* HR Action Stream */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 style={display} className="text-lg text-[#061B33] uppercase">
            Recent HR Execution Decisions
          </h4>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-mono font-bold rounded-lg">
            3 Recorded Actions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">
                <th className="pb-3">Action ID</th>
                <th className="pb-3">Executing HR</th>
                <th className="pb-3">Action Type</th>
                <th className="pb-3">Target Subject</th>
                <th className="pb-3">Resolution Details</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {hrActions.map((act) => (
                <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-slate-500">{act.id}</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      @{act.hrName}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      act.actionType === "LEAVE_APPROVAL"
                        ? "bg-emerald-100 text-emerald-800"
                        : act.actionType === "LEAVE_REJECTION"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {act.actionType}
                    </span>
                  </td>
                  <td className="py-3 font-bold text-slate-800">{act.target}</td>
                  <td className="py-3 text-slate-600">{act.detail}</td>
                  <td className="py-3 text-right font-mono text-[11px] text-slate-400">
                    {act.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Registered by HR (Live DB Synced) */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 style={display} className="text-lg text-[#061B33] uppercase">
              Staff Records Added by HR
            </h4>
            <p className="text-[11px] text-slate-400">Synced directly from employee-service database.</p>
          </div>
          <span className="px-3 py-1 bg-[#20B685]/15 text-[#20B685] font-black text-xs rounded-full">
            {onboardedList.length} Active Profiles
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">
                <th className="pb-3">EMP Code</th>
                <th className="pb-3">Full Name</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Designation</th>
                <th className="pb-3">Official Email</th>
                <th className="pb-3 text-right">Compensation (CTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {onboardedList.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 font-mono font-bold text-[#FB9A1E]">
                    {emp.employeeCode || `EMP#${emp.id}`}
                  </td>
                  <td className="py-3 font-bold text-slate-900">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="py-3 text-slate-600">{emp.department}</td>
                  <td className="py-3">{emp.designation}</td>
                  <td className="py-3 font-mono text-slate-500 text-[11px]">{emp.email}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    ₹{emp.salary ? emp.salary.toLocaleString() : "N/A"}
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