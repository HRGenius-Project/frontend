
import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import axiosClient from "../../../api/axiosClient";

const AttendanceStatsCards = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    clockedIn: 0,
    pendingLeaves: null,
    shiftCompliance: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const employeeResponse = await axiosClient.get("/api/employees");

        if (!Array.isArray(employeeResponse.data)) {
          throw new Error("Unexpected employee API response.");
        }

        const employees = employeeResponse.data;
        const today = new Date().toLocaleDateString("en-CA");

        const attendanceResults = await Promise.allSettled(
          employees.map((employee) => {
            const code = employee.employeeCode || employee.empCode;

            if (!code) return Promise.resolve([]);

            return axiosClient
              .get(`/api/attendance/history/${encodeURIComponent(code)}`)
              .then((response) =>
                Array.isArray(response.data) ? response.data : []
              );
          })
        );

        let clockedIn = 0;

        attendanceResults.forEach((result) => {
          if (result.status !== "fulfilled") return;

          const todayRecord = result.value.find(
            (record) => record.attendanceDate === today
          );

          if (todayRecord?.punchInTime && !todayRecord?.punchOutTime) {
            clockedIn += 1;
          }
        });

        if (!cancelled) {
          setStats({
            totalStaff: employees.length,
            clockedIn,
            pendingLeaves: null,
            shiftCompliance: null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch attendance stats:", err);

        if (!cancelled) {
          setError("Unable to load attendance statistics.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const display = (value) => {
    if (loading) return "...";
    if (value === null) return "—";
    return value;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Staff</p>
            <h3 className="mt-2 font-display text-3xl text-[#061B33]">
              {display(stats.totalStaff)}
            </h3>
          </div>
          <div className="rounded-xl bg-[#FB9A1E]/10 p-3">
            <Users className="h-6 w-6 text-[#FB9A1E]" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Today Clocked-In
            </p>
            <h3 className="mt-2 font-display text-3xl text-[#061B33]">
              {display(stats.clockedIn)}
            </h3>
            <p className="mt-1 text-xs text-[#20B685]">
              Punched in, not yet punched out
            </p>
          </div>
          <div className="rounded-xl bg-[#20B685]/10 p-3">
            <UserCheck className="h-6 w-6 text-[#20B685]" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Pending Leave Requests
            </p>
            <h3 className="mt-2 font-display text-3xl text-[#061B33]">
              {display(stats.pendingLeaves)}
            </h3>
            <p className="mt-1 text-xs text-[#A58BFA]">
              Awaiting HR approval
            </p>
          </div>
          <div className="rounded-xl bg-[#A58BFA]/10 p-3">
            <CalendarClock className="h-6 w-6 text-[#A58BFA]" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Shift Compliance
            </p>
            <h3 className="mt-2 font-display text-3xl text-[#061B33]">
              {display(stats.shiftCompliance)}
              {stats.shiftCompliance !== null && !loading ? "%" : ""}
            </h3>
            <p className="mt-1 text-xs text-[#20B685]">
              On-time attendance rate
            </p>
          </div>
          <div className="rounded-xl bg-[#20B685]/10 p-3">
            <TrendingUp className="h-6 w-6 text-[#20B685]" />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#FF5740] sm:col-span-2 xl:col-span-4">
          {error}
        </p>
      )}
    </div>
  );
};

export default AttendanceStatsCards;
