import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Users, CalendarCheck, Clock, CreditCard, CheckCircle, XCircle, UserPlus, Search, LogOut, Bell, TrendingUp, X, AlertCircle, } from "lucide-react";
import AttendanceLeavesTab from "../components/hr/attendance-leaves/AttendenceLeavesTab";
//Locked Brand Color Tokens
const C = {
    navy: "#061B33",
    orange: "#FB9A1E",
    purple: "#A58BFA",
    coral: "#FF5740",
    green: "#20B685",
    lime: "#E6FB3F",
    white: "#FFFFFF",
};
const display = {
    fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
    letterSpacing: "0.03em",
};
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 " +
    "placeholder:text-slate-400 transition focus:bg-white focus:border-[#061B33] focus:outline-none focus:ring-2 focus:ring-[#061B33]/10";
export default function HRDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    //Modal State
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    //New Employee Form Data
    const initialFormData = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "Engineering",
        designation: "",
        salary: "",
        joiningDate: new Date().toISOString().split("T")[0],
    };
    const [formData, setFormData] = useState(initialFormData);
    //Current Logged In HR User
    const [currentUser] = useState(() => {
        try {
            return (JSON.parse(localStorage.getItem("hrgenius_user") ||
                sessionStorage.getItem("hrgenius_user")) || {});
        }
        catch {
            return {};
        }
    });
    //Stats Data State
    const [stats, setStats] = useState({
        totalEmployees: 0,
        presentToday: 0,
        pendingLeaves: 3,
        payrollStatus: "Processed",
    });
    //Mock Pending Leaves State (Leaves-service offline safe)
    const [leaves, setLeaves] = useState([
        {
            id: 101,
            empCode: "EMP#0012",
            name: "Rohan Verma",
            department: "Engineering",
            type: "Sick Leave",
            days: "2 Days",
            date: "Oct 14 - Oct 15",
            status: "PENDING",
        },
        {
            id: 102,
            empCode: "EMP#0045",
            name: "Ananya Sharma",
            department: "Product",
            type: "Casual Leave",
            days: "1 Day",
            date: "Oct 16",
            status: "PENDING",
        },
        {
            id: 103,
            empCode: "EMP#0089",
            name: "Vikram Malhotra",
            department: "Sales",
            type: "Earned Leave",
            days: "4 Days",
            date: "Oct 20 - Oct 23",
            status: "PENDING",
        },
    ]);
    //Employee Directory State
    const [employees, setEmployees] = useState([]);
    //Fetch Employees from employee-service
    const loadEmployees = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/api/employees");
            if (res.data) {
                const rawList = Array.isArray(res.data) ? res.data : [];
                const formatted = rawList.map((e) => ({
                    id: e.id,
                    empCode: e.employeeCode || `EMP#${String(e.id).padStart(4, "0")}`,
                    name: e.fullName ||
                        `${e.firstName || ""} ${e.lastName || ""}`.trim() ||
                        e.name ||
                        "Unknown",
                    role: e.designation || e.role || "Staff",
                    dept: e.department || e.dept || "General",
                    shift: e.shift || "General (9-6)",
                    status: e.status || "ACTIVE",
                }));
                setEmployees(formatted);
                setStats((prev) => ({
                    ...prev,
                    totalEmployees: formatted.length,
                    presentToday: Math.round(formatted.length * 0.85) || 1,
                }));
            }
        }
        catch (err) {
            console.warn("Employee fetch issue:", err.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadEmployees();
    }, []);
    //Handle Form Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    //Submit Onboard Employee Form
    const handleOnboardSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormError("");
        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                department: formData.department,
                designation: formData.designation.trim(),
                salary: parseFloat(formData.salary) || 50000,
                joiningDate: formData.joiningDate,
            };
            await axiosClient.post("/api/employees", payload);
            //Refresh table with new record
            await loadEmployees();
            //Reset and close modal
            setFormData(initialFormData);
            setShowModal(false);
        }
        catch (err) {
            console.error("Onboarding failed:", err);
            const msg = err.response?.data?.message ||
                err.response?.data?.error ||
                "Employee create karne me error aaya. Backend logs check karo.";
            setFormError(msg);
        }
        finally {
            setSubmitting(false);
        }
    };
    //Leave Actions Handler (Mock)
    const handleLeaveAction = (id) => {
        setLeaves((prev) => prev.filter((item) => item.id !== id));
        setStats((prev) => ({
            ...prev,
            pendingLeaves: Math.max(0, prev.pendingLeaves - 1),
        }));
    };
    //Logout Handler
    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
    };
    const filteredEmployees = employees.filter((emp) => `${emp.name} ${emp.empCode} ${emp.dept} ${emp.role}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()));
    return (<div className="min-h-screen bg-[#F6F8FB] text-slate-900 flex font-['Plus_Jakarta_Sans',sans-serif]">

      {/*================= SIDEBAR =================*/}

      <aside className="w-64 bg-[#061B33] text-white flex flex-col justify-between p-6 shrink-0 border-r border-slate-800">

        <div>

          <div className="flex items-center gap-2.5 pb-8 border-b border-white/10 cursor-pointer" onClick={() => navigate("/")}>

            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FF3B30] text-lg font-black text-white shadow-sm">

              H

            </span>

            <span className="text-xl font-black tracking-tight text-white">

              HR<span className="text-[#FF3B30]">GENIUS</span>

            </span>

          </div>

          <nav className="mt-8 space-y-2">

            {[
            {
                id: "overview",
                label: "Dashboard",
                icon: <TrendingUp className="w-4 h-4"/>,
            },
            {
                id: "employees",
                label: "Employees",
                icon: <Users className="w-4 h-4"/>,
            },
            {
                id: "attendance",
                label: "Attendance & Leaves",
                icon: <Clock className="w-4 h-4"/>,
            },
            {
                id: "payroll",
                label: "Payroll Run",
                icon: <CreditCard className="w-4 h-4"/>,
            },
        ].map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === tab.id
                ? "bg-[#FB9A1E] text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"}`}>

                {tab.icon}

                <span>{tab.label}</span>

              </button>))}

          </nav>

        </div>

        <div className="pt-6 border-t border-white/10">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2.5">

              <div className="w-8 h-8 rounded-full bg-[#A58BFA] text-slate-950 font-black flex items-center justify-center text-xs">

                HR

              </div>

              <div className="overflow-hidden">

                <p className="text-xs font-black text-white truncate">

                  {currentUser.sub || "HR Manager"}

                </p>

                <p className="text-[10px] text-slate-400 truncate">

                  {currentUser.email || "hrone@hrgenius.com"}

                </p>

              </div>

            </div>

            <button onClick={handleLogout} title="Logout" className="text-slate-400 hover:text-[#FF5740] transition-colors p-1.5">

              <LogOut className="w-4 h-4"/>

            </button>

          </div>

        </div>

      </aside>

      {/*================= MAIN DASHBOARD CONTENT =================*/}

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/*Top Header*/}

        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">

          <div>

            <h1 style={display} className="text-3xl uppercase tracking-tight text-[#061B33]">

              Workforce Operations

            </h1>

            <p className="text-xs text-slate-400 font-medium">

              Manage records, verify attendance, and execute actions.

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="relative">

              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"/>

              <input type="text" placeholder="Search EMP code, name, department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:border-[#061B33] transition-all w-64"/>

            </div>

            <button className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all relative">

              <Bell className="w-4 h-4"/>

              <span className="w-2 h-2 rounded-full bg-[#FF5740] absolute top-2 right-2"></span>

            </button>

          </div>

        </header>

        {/* Dashboard Body */}
        {activeTab === "attendance" ? (<div className="p-8">
            <AttendanceLeavesTab />
          </div>) : (<div className="p-8 space-y-8">

          {/*Metric Cards*/}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">

                  Total Staff

                </span>

                <div className="w-9 h-9 rounded-xl bg-[#FB9A1E]/15 flex items-center justify-center text-[#FB9A1E]">

                  <Users className="w-5 h-5"/>

                </div>

              </div>

              <div>

                <span style={display} className="text-4xl text-[#061B33]">

                  {stats.totalEmployees}

                </span>

                <p className="text-[11px] text-[#20B685] font-bold flex items-center gap-1 mt-0.5">

                  <TrendingUp className="w-3 h-3"/> Live from Employee-Service

                </p>

              </div>

            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">

                  Today Present

                </span>

                <div className="w-9 h-9 rounded-xl bg-[#20B685]/15 flex items-center justify-center text-[#20B685]">

                  <CalendarCheck className="w-5 h-5"/>

                </div>

              </div>

              <div>

                <span style={display} className="text-4xl text-[#061B33]">

                  {stats.presentToday}

                </span>

                <p className="text-[11px] text-slate-400 font-bold mt-0.5">

                  Shift Attendance Active

                </p>

              </div>

            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">

                  Action Required

                </span>

                <div className="w-9 h-9 rounded-xl bg-[#FF5740]/15 flex items-center justify-center text-[#FF5740]">

                  <Clock className="w-5 h-5"/>

                </div>

              </div>

              <div>

                <span style={display} className="text-4xl text-[#FF5740]">

                  {leaves.length}

                </span>

                <p className="text-[11px] text-slate-500 font-bold mt-0.5">

                  Pending Leave Requests

                </p>

              </div>

            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between h-36">

              <div className="flex items-center justify-between">

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">

                  Payroll Cycle

                </span>

                <div className="w-9 h-9 rounded-xl bg-[#A58BFA]/20 flex items-center justify-center text-[#A58BFA]">

                  <CreditCard className="w-5 h-5"/>

                </div>

              </div>

              <div>

                <span style={display} className="text-3xl text-[#061B33]">

                  {stats.payrollStatus}

                </span>

                <p className="text-[11px] text-[#20B685] font-bold mt-0.5">

                  Batch Sync Ready

                </p>

              </div>

            </div>

          </div>

          {/*Pending Leaves*/}

          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 style={display} className="text-2xl text-[#061B33] uppercase">

                  Pending Leave Requests

                </h3>

                <p className="text-xs text-slate-400 font-medium">

                  Review and verify employee absences.

                </p>

              </div>

              <span className="px-3 py-1 rounded-full bg-[#FF5740]/10 text-[#FF5740] font-black text-xs">

                {leaves.length} Needs Review

              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead>

                  <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">

                    <th className="pb-3">Employee</th>

                    <th className="pb-3">Department</th>

                    <th className="pb-3">Leave Type</th>

                    <th className="pb-3">Duration</th>

                    <th className="pb-3">Dates</th>

                    <th className="pb-3 text-right">Action</th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">

                  {leaves.map((leave) => (<tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">

                      <td className="py-4">

                        <p className="font-bold text-slate-900">{leave.name}</p>

                        <span className="font-mono text-[10px] text-slate-400 font-bold">

                          {leave.empCode}

                        </span>

                      </td>

                      <td className="py-4 text-slate-600">

                        {leave.department}

                      </td>

                      <td className="py-4">

                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">

                          {leave.type}

                        </span>

                      </td>

                      <td className="py-4 font-bold text-slate-900">

                        {leave.days}

                      </td>

                      <td className="py-4 text-slate-500 font-mono text-[11px]">

                        {leave.date}

                      </td>

                      <td className="py-4 text-right">

                        <div className="inline-flex items-center gap-2">

                          <button onClick={() => handleLeaveAction(leave.id)} className="px-3 py-1.5 rounded-xl bg-[#20B685] text-white font-bold text-[11px] hover:bg-[#1ba074] transition-all flex items-center gap-1 shadow-sm active:scale-95">

                            <CheckCircle className="w-3.5 h-3.5"/> Approve

                          </button>

                          <button onClick={() => handleLeaveAction(leave.id)} className="px-3 py-1.5 rounded-xl bg-slate-100 text-rose-600 font-bold text-[11px] hover:bg-rose-50 transition-all flex items-center gap-1 active:scale-95">

                            <XCircle className="w-3.5 h-3.5"/> Reject

                          </button>

                        </div>

                      </td>

                    </tr>))}

                </tbody>

              </table>

            </div>

          </div>

          {/*Employee Directory*/}

          <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <div>

                <h3 style={display} className="text-2xl text-[#061B33] uppercase">

                  Employee Directory

                </h3>

                <p className="text-xs text-slate-400 font-medium">

                  Verified active roster linked to employee service.

                </p>

              </div>

              <button onClick={() => setShowModal(true)} className="cursor-pointer px-4 py-2 rounded-2xl bg-[#061B33] text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm active:scale-95">

                <UserPlus className="w-4 h-4 text-[#E6FB3F]"/>

                <span>Onboard Employee</span>

              </button>

            </div>

            {loading && employees.length === 0 ? (<div className="py-8 text-center text-xs text-slate-400 font-semibold animate-pulse">

                Loading employees from Employee-Service...

              </div>) : filteredEmployees.length === 0 ? (<div className="py-8 text-center text-xs text-slate-400 font-semibold">

                No matching employees found.

              </div>) : (<div className="overflow-x-auto">

                <table className="w-full text-left text-xs">

                  <thead>

                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">

                      <th className="pb-3">Code</th>

                      <th className="pb-3">Name & Role</th>

                      <th className="pb-3">Department</th>

                      <th className="pb-3">Assigned Shift</th>

                      <th className="pb-3">Status</th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">

                    {filteredEmployees.map((emp) => (<tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">

                        <td className="py-4 font-mono font-bold text-[#FB9A1E]">

                          {emp.empCode}

                        </td>

                        <td className="py-4">

                          <p className="font-bold text-slate-900">{emp.name}</p>

                          <p className="text-[11px] text-slate-400 font-semibold">

                            {emp.role}

                          </p>

                        </td>

                        <td className="py-4 text-slate-600">{emp.dept}</td>

                        <td className="py-4 text-slate-500 font-mono text-[11px]">

                          {emp.shift}

                        </td>

                        <td className="py-4">

                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${emp.status === "ACTIVE"
                        ? "bg-[#20B685]/15 text-[#20B685]"
                        : "bg-[#FB9A1E]/15 text-[#FB9A1E]"}`}>

                            {emp.status}

                          </span>

                        </td>

                      </tr>))}

                  </tbody>

                </table>

              </div>)}

          </div>

        </div>)}
      </main>

      {/*================= ONBOARD EMPLOYEE MODAL =================*/}

      {showModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">

          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            {/*Modal Header*/}

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F6F8FB]">

              <div>

                <h3 style={display} className="text-xl uppercase tracking-wide text-[#061B33]">

                  Onboard New Employee

                </h3>

                <p className="text-[11px] font-semibold text-slate-400">

                  Direct sync to Employee Service database

                </p>

              </div>

              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition">

                <X className="w-4 h-4"/>

              </button>

            </div>

            {/*Modal Body*/}

            <form onSubmit={handleOnboardSubmit} className="p-6 space-y-4">

              {formError && (<div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">

                  <AlertCircle className="w-4 h-4 shrink-0"/>

                  <span>{formError}</span>

                </div>)}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    First Name

                  </label>

                  <input type="text" required name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="e.g. Priyanshu" className={inputClass}/>

                </div>

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Last Name

                  </label>

                  <input type="text" required name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="e.g. Kumar" className={inputClass}/>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Work Email

                  </label>

                  <input type="email" required name="email" value={formData.email} onChange={handleInputChange} placeholder="name@hrgenius.com" className={inputClass}/>

                </div>

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Phone Number

                  </label>

                  <input type="tel" required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" className={inputClass}/>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Department

                  </label>

                  <select name="department" value={formData.department} onChange={handleInputChange} className={inputClass}>

                    <option value="Engineering">Engineering</option>

                    <option value="Human Resources">Human Resources</option>

                    <option value="Product">Product</option>

                    <option value="Sales">Sales</option>

                    <option value="Finance">Finance</option>

                    <option value="Operations">Operations</option>

                  </select>

                </div>

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Designation

                  </label>

                  <input type="text" required name="designation" value={formData.designation} onChange={handleInputChange} placeholder="e.g. Backend Developer" className={inputClass}/>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Salary (Monthly / CTC)

                  </label>

                  <input type="number" required name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. 65000" className={inputClass}/>

                </div>

                <div>

                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">

                    Joining Date

                  </label>

                  <input type="date" required name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className={inputClass}/>

                </div>

              </div>

              {/*Form Buttons*/}

              <div className="flex items-center justify-end gap-3 pt-3">

                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition">

                  Cancel

                </button>

                <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-xl bg-[#061B33] text-white text-xs font-bold hover:bg-slate-800 transition shadow-md disabled:opacity-60 flex items-center gap-2">

                  {submitting ? (<div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>) : (<>

                      <UserPlus className="w-3.5 h-3.5 text-[#E6FB3F]"/>

                      <span>Create Record</span>

                    </>)}

                </button>

              </div>

            </form>

          </div>

        </div>)}

    </div>);
}
