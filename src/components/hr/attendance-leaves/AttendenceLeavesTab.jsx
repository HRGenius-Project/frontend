import React, { useState } from "react";
import AttendanceStatsCards from "./AttendanceStatsCards";
import PendingLeavesApproval from "./PendingLeavesApproval";
import EmployeeAttendanceRoster from "./EmployeeAttendanceRoster";
import EmployeeCalendarModal from "./EmployeeCalendarModal";

const AttendanceLeavesTab = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  return (
    <section className="min-h-screen bg-[#F6F8FB] p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold text-[#061B33]">
          Attendance & Leaves
        </h1>

        <p className="mb-6 text-slate-500">
          Monitor staff attendance and leave requests.
        </p>

        <div className="space-y-6">
          <AttendanceStatsCards />
          <PendingLeavesApproval />
          <EmployeeAttendanceRoster
            onSelectEmployee={(employee) => setSelectedEmployee(employee)}
          />

          {selectedEmployee && (
            <EmployeeCalendarModal
              employee={selectedEmployee}
              onClose={() => setSelectedEmployee(null)}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AttendanceLeavesTab;
