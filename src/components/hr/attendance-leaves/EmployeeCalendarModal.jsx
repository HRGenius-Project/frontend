
import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import axiosClient from "../../../api/axiosClient";

const EmployeeCalendarModal = ({ employee, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const employeeCode = employee?.employeeCode || employee?.empCode;

  useEffect(() => {
    if (!employeeCode) {
      setAttendance([]);
      setError("Employee code is missing.");
      return;
    }

    let cancelled = false;

    const fetchAttendance = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axiosClient.get(
          `/api/attendance/history/${encodeURIComponent(employeeCode)}`
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected attendance API response.");
        }

        if (!cancelled) {
          setAttendance(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err);

        if (!cancelled) {
          setError(
            err.response?.status === 401
              ? "Session expired. Please log in again."
              : err.response?.status === 403
                ? "You don't have permission to view this attendance."
                : "Unable to load attendance. Please try again."
          );
          setAttendance([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAttendance();

    return () => {
      cancelled = true;
    };
  }, [employeeCode]);

  const changeMonth = (amount) => {
    setCurrentMonth(new Date(year, month + amount, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarDays = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthAttendance = useMemo(() => {
    return attendance.filter((record) => {
      if (!record.attendanceDate) return false;

      const date = record.attendanceDate.slice(0, 10);
      const [recordYear, recordMonth] = date.split("-").map(Number);

      return recordYear === year && recordMonth === month + 1;
    });
  }, [attendance, year, month]);

  const attendanceByDate = useMemo(() => {
    return new Map(
      monthAttendance.map((record) => [
        record.attendanceDate.slice(0, 10),
        record,
      ])
    );
  }, [monthAttendance]);

  const formatTime = (value) => {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDayInfo = (day) => {
    const dateKey = [
      year,
      String(month + 1).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    const record = attendanceByDate.get(dateKey);

    if (!record) {
      return {
        label: "No record",
        className: "bg-slate-50 text-slate-400",
        badgeClass: "bg-slate-100 text-slate-500",
      };
    }

    const status = String(record.status || "").toUpperCase();

    const statusStyles = {
      PRESENT: {
        label: "Present",
        className: "bg-[#20B685]/10 text-[#20B685]",
        badgeClass: "bg-[#20B685]/15 text-[#20B685]",
      },
      HALF_DAY: {
        label: "Half-day",
        className: "bg-[#FB9A1E]/10 text-[#FB9A1E]",
        badgeClass: "bg-[#FB9A1E]/15 text-[#FB9A1E]",
      },
      ABSENT: {
        label: "Absent",
        className: "bg-[#FF5740]/10 text-[#FF5740]",
        badgeClass: "bg-[#FF5740]/15 text-[#FF5740]",
      },
      LEAVE: {
        label: "Leave",
        className: "bg-[#A58BFA]/10 text-[#A58BFA]",
        badgeClass: "bg-[#A58BFA]/15 text-[#A58BFA]",
      },
    };

    const style = statusStyles[status] || {
      label: status.replaceAll("_", " ") || "Unknown",
      className: "bg-slate-100 text-slate-600",
      badgeClass: "bg-slate-200 text-slate-600",
    };

    return {
      ...style,
      punchIn: formatTime(record.punchInTime),
      punchOut: formatTime(record.punchOutTime),
      totalHours: record.totalHours,
    };
  };

  const presentCount = monthAttendance.filter(
    (record) => record.status === "PRESENT"
  ).length;

  const halfDayCount = monthAttendance.filter(
    (record) => record.status === "HALF_DAY"
  ).length;

  const absentCount = monthAttendance.filter(
    (record) => record.status === "ABSENT"
  ).length;

  const leaveCount = monthAttendance.filter(
    (record) => record.status === "LEAVE"
  ).length;

  if (!employee) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#FB9A1E]/10 p-3">
              <CalendarDays className="h-6 w-6 text-[#FB9A1E]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#061B33]">
                {employee.name || `${employee.firstName || ""} ${employee.lastName || ""}`.trim()}
              </h2>

              <p className="text-sm text-slate-500">
                {employeeCode} · {employee.department || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="rounded-lg p-2 text-[#061B33] hover:bg-slate-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="min-w-32 text-center text-sm font-bold text-[#061B33]">
              {monthLabel}
            </span>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="rounded-lg p-2 text-[#061B33] hover:bg-slate-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close calendar"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#FF5740]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {loading && (
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading attendance records...
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-[#FF5740]/20 bg-[#FF5740]/5 p-4 text-sm text-[#FF5740]">
              {error}
            </div>
          )}

          <div className="mb-4 grid grid-cols-7 gap-1 text-center sm:gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="py-2 text-xs font-bold text-slate-500 sm:text-sm"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, index) => {
              const info = day ? getDayInfo(day) : null;

              return (
                <div
                  key={index}
                  className={`flex min-h-16 flex-col items-center justify-start gap-1 overflow-hidden rounded-lg border border-slate-100 p-1 sm:min-h-24 sm:rounded-xl sm:p-2 ${
                    info ? info.className : "bg-slate-50"
                  }`}
                >
                  {day && (
                    <>
                      <span className="text-xs font-bold sm:text-sm">
                        {day}
                      </span>

                      <span
                        className={`rounded-full px-1 py-0.5 text-[9px] font-semibold sm:px-2 sm:text-[10px] ${info.badgeClass}`}
                      >
                        {info.label}
                      </span>

                      {info.punchIn && (
                        <span className="hidden text-[10px] text-slate-600 sm:block">
                          In: {info.punchIn}
                        </span>
                      )}

                      {info.punchOut && (
                        <span className="hidden text-[10px] text-slate-600 sm:block">
                          Out: {info.punchOut}
                        </span>
                      )}

                      {info.totalHours != null && (
                        <span className="hidden text-[10px] text-slate-600 sm:block">
                          {info.totalHours} hrs
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Present</p>
              <h3 className="mt-1 text-2xl font-bold text-[#20B685]">
                {presentCount}
              </h3>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Half-days</p>
              <h3 className="mt-1 text-2xl font-bold text-[#FB9A1E]">
                {halfDayCount}
              </h3>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Absents</p>
              <h3 className="mt-1 text-2xl font-bold text-[#FF5740]">
                {absentCount}
              </h3>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">Leaves</p>
              <h3 className="mt-1 text-2xl font-bold text-[#A58BFA]">
                {leaveCount}
              </h3>
            </div>
          </div>

          {!loading && !error && monthAttendance.length === 0 && (
            <p className="mt-4 text-xs text-slate-400">
              No attendance records found for {monthLabel}. Dates without
              records are not assumed to be absent or leave.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCalendarModal;
