
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axiosClient from "../../../api/axiosClient";

const EmployeeAttendanceRoster = ({ onSelectEmployee }) => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const formatTime = (value) => {
      if (!value) return "--";

      // Backend LocalDateTime has no timezone offset.
      // Read its time portion directly to avoid browser timezone shifting.
      const timePart = value.split("T")[1];
      if (!timePart) return "--";

      const [hourString, minuteString] = timePart.split(":");
      const hour = Number(hourString);

      if (!Number.isFinite(hour) || !minuteString) return "--";

      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;

      return `${displayHour}:${minuteString.slice(0, 2)} ${period}`;
    };

    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosClient.get("/api/employees");

        if (!Array.isArray(response.data)) {
          throw new Error("Unexpected employee API response.");
        }

        const employeeList = response.data;

        // Fetch attendance history for each employee.
        const employeesWithAttendance = await Promise.all(
          employeeList.map(async (emp) => {
            const code = emp.employeeCode || emp.empCode;

            if (!code) {
              return { ...emp, punchIn: "--", punchOut: "--" };
            }

            try {
              const attendanceResponse = await axiosClient.get(
                `/api/attendance/history/${encodeURIComponent(code)}`
              );

              const records = Array.isArray(attendanceResponse.data)
                ? attendanceResponse.data
                : [];

              // API normally returns newest records first, but sort defensively.
              const latestRecord = [...records].sort((a, b) =>
                (b.attendanceDate || "").localeCompare(a.attendanceDate || "")
              )[0];

              return {
                ...emp,
                punchIn: formatTime(latestRecord?.punchInTime),
                punchOut: formatTime(latestRecord?.punchOutTime),
              };
            } catch (attendanceError) {
              console.error(
                `Failed to fetch attendance for ${code}:`,
                attendanceError
              );

              return {
                ...emp,
                punchIn: "--",
                punchOut: "--",
              };
            }
          })
        );

        if (!cancelled) {
          setEmployees(employeesWithAttendance);
        }
      } catch (err) {
        console.error("Failed to fetch employees:", err);

        if (!cancelled) {
          setError(
            err.response?.status === 403
              ? "You don't have permission to view employees."
              : "Unable to load employees. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName || emp.name || ""} ${
      emp.lastName || ""
    }`
      .trim()
      .toLowerCase();

    const employeeCode = (
      emp.employeeCode ||
      emp.empCode ||
      ""
    ).toLowerCase();

    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      employeeCode.includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === "ALL" ||
      emp.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-[#061B33]">
        Employee Attendance
      </h2>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search name or employee code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#061B33]"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#061B33] outline-none focus:border-[#061B33]"
        >
          <option value="ALL">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Operations">Operations</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="p-3">Employee Code</th>
              <th className="p-3">Employee Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Shift</th>
              <th className="p-3">Punch-In</th>
              <th className="p-3">Punch-Out</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  Loading employees and attendance...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#FF5740]">
                  {error}
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No employees found.
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => {
                const fullName =
                  `${emp.firstName || ""} ${emp.lastName || ""}`.trim() ||
                  emp.name ||
                  "--";

                const employeeCode =
                  emp.employeeCode || emp.empCode || "--";

                const employmentStatus = emp.status || "UNKNOWN";

                const statusClass =
                  employmentStatus === "ACTIVE"
                    ? "bg-[#20B685]/10 text-[#20B685]"
                    : employmentStatus === "INACTIVE"
                      ? "bg-[#FF5740]/10 text-[#FF5740]"
                      : "bg-[#A58BFA]/10 text-[#A58BFA]";

                return (
                  <tr
                    key={emp.id ?? employeeCode}
                    onClick={() =>
                      onSelectEmployee?.({
                        ...emp,
                        name: fullName,
                        empCode: employeeCode,
                      })
                    }
                    className="cursor-pointer hover:bg-slate-50"
                  >
                    <td className="p-3">{employeeCode}</td>
                    <td className="p-3 font-semibold text-[#061B33]">
                      {fullName}
                    </td>
                    <td className="p-3">{emp.department || "--"}</td>
                    <td className="p-3">{emp.shift || "--"}</td>
                    <td className="p-3">{emp.punchIn || "--"}</td>
                    <td className="p-3">{emp.punchOut || "--"}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
                      >
                        {employmentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendanceRoster;
