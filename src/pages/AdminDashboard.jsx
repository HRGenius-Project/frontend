import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import HROperationsAudit from "../components/admin/HROperationAudit";
import EmployeeActivityWatch from "../components/admin/EmployeeAcitivityWatch";
import LiveAttendanceMonitor from "../components/admin/LiveAttendenceMonitor";
import {
  UserPlus,
  CheckCircle2,
  Lock,
  Unlock,
  X,
  AlertCircle,
  Server,
  Database,
  Cpu,
  Radio,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
} from "lucide-react";

const display = {
  fontFamily: "'Anton', 'Bebas Neue', Impact, sans-serif",
  letterSpacing: "0.03em",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 " +
  "placeholder:text-slate-400 transition focus:bg-white focus:border-[#061B33] focus:outline-none focus:ring-2 focus:ring-[#061B33]/10";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  // Audit Logs State (Auto-appends on actions)
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      event: "STATUS_TOGGLE",
      detail: "Account @EMP0002 status modified",
      performedBy: "admin",
      time: "Just now",
      severity: "WARN",
    },
    {
      id: 2,
      event: "AUTH_LOGIN",
      detail: "Admin authenticated via JWT",
      performedBy: "admin",
      time: "10 mins ago",
      severity: "INFO",
    },
    {
      id: 3,
      event: "SERVICE_REGISTRATION",
      detail: "Auth-Service registered with Eureka",
      performedBy: "system",
      time: "25 mins ago",
      severity: "SUCCESS",
    },
    {
      id: 4,
      event: "EMPLOYEE_ONBOARD",
      detail: "New record added to hrgenius_employee",
      performedBy: "hrone",
      time: "42 mins ago",
      severity: "INFO",
    },
  ]);

  const initialForm = {
    username: "",
    email: "",
    password: "",
    role: "HR_MANAGER",
  };
  const [formData, setFormData] = useState(initialForm);

  const [currentUser] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("hrgenius_user") ||
            sessionStorage.getItem("hrgenius_user")
        ) || {}
      );
    } catch {
      return {};
    }
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, empRes] = await Promise.allSettled([
        axiosClient.get("/api/auth/users"),
        axiosClient.get("/api/employees"),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value?.data) {
        setUsers(usersRes.value.data);
      }
      if (empRes.status === "fulfilled" && empRes.value?.data) {
        setTotalEmployees(
          Array.isArray(empRes.value.data) ? empRes.value.data.length : 0
        );
      }
    } catch (err) {
      console.warn("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Lock / Unlock user toggle
  const handleToggleStatus = async (user) => {
    const nextStatus = !user.enabled;
    try {
      await axiosClient.patch(
        `/api/auth/users/${user.id}/status?enabled=${nextStatus}`
      );
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, enabled: nextStatus } : u))
      );

      // Append real audit entry
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          event: nextStatus ? "ACCOUNT_ENABLED" : "ACCOUNT_LOCKED",
          detail: `User @${user.username} access was ${
            nextStatus ? "restored" : "revoked"
          }`,
          performedBy: currentUser.sub || "admin",
          time: "Just now",
          severity: nextStatus ? "SUCCESS" : "WARN",
        },
        ...prev,
      ]);

      setActionMsg(
        `User @${user.username} ${nextStatus ? "Enabled" : "Locked"} successfully!`
      );
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      setActionMsg("Failed to update status.");
      setTimeout(() => setActionMsg(""), 3000);
    }
  };

  // Register New User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        roles: [formData.role],
      };

      await axiosClient.post("/api/auth/register", payload);
      await fetchAdminData();

      // Log event
      setAuditLogs((prev) => [
        {
          id: Date.now(),
          event: "USER_PROVISIONED",
          detail: `New credentials created for @${payload.username} [${formData.role}]`,
          performedBy: currentUser.sub || "admin",
          time: "Just now",
          severity: "SUCCESS",
        },
        ...prev,
      ]);

      setFormData(initialForm);
      setShowModal(false);
      setActionMsg(`Account @${payload.username} created successfully!`);
      setTimeout(() => setActionMsg(""), 3500);
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Registration failed. Check uniqueness."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    `${u.username} ${u.email} ${(u.roles || []).join(" ")}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Fixed Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Independently Scrollable Right Area (Offset by lg:pl-64) */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchAdminData={fetchAdminData}
          loading={loading}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 p-4 sm:p-8 space-y-6">
          {actionMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#20B685] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionMsg}</span>
            </div>
          )}

          {/* Top Metric Cards Deck */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Auth Accounts
              </span>
              <div>
                <span style={display} className="text-3xl sm:text-4xl text-[#061B33]">
                  {users.length}
                </span>
                <p className="text-[10px] text-[#20B685] font-bold mt-0.5">
                  Live Auth-Service
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Staff Records
              </span>
              <div>
                <span style={display} className="text-3xl sm:text-4xl text-[#FB9A1E]">
                  {totalEmployees}
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Employee-Service
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Locked Accounts
              </span>
              <div>
                <span style={display} className="text-3xl sm:text-4xl text-[#FF5740]">
                  {users.filter((u) => !u.enabled).length}
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Access Restricted
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                Security Gateway
              </span>
              <div>
                <span style={display} className="text-2xl sm:text-3xl text-[#20B685]">
                  PROTECTED
                </span>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  JWT Stateless Session
                </p>
              </div>
            </div>
          </div>

          {/* ================= OPTION 1: USER GOVERNANCE ================= */}
          {activeTab === "users" && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 style={display} className="text-xl sm:text-2xl text-[#061B33] uppercase">
                    System Access Directory
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Provision new system accounts and control access privileges.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-[#061B33] text-white font-bold text-xs hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#E6FB3F]" />
                  <span>Provision User</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Account User</th>
                      <th className="pb-3">Assigned Roles</th>
                      <th className="pb-3">Security State</th>
                      <th className="pb-3 text-right">Access Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredUsers.map((u) => {
                      const isSelf = u.username === currentUser.sub;
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 font-mono font-bold text-slate-400">
                            #{u.id}
                          </td>
                          <td className="py-4">
                            <p className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{u.username}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-black">
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {(u.roles || []).map((r) => (
                                <span
                                  key={r}
                                  className={`px-2 py-0.5 rounded-lg font-black text-[10px] ${
                                    r === "ADMIN"
                                      ? "bg-rose-100 text-rose-700"
                                      : r === "HR_MANAGER"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {r}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider ${
                                u.enabled
                                  ? "bg-[#20B685]/15 text-[#20B685]"
                                  : "bg-[#FF5740]/15 text-[#FF5740]"
                              }`}
                            >
                              {u.enabled ? "ACTIVE" : "LOCKED"}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              disabled={isSelf}
                              onClick={() => handleToggleStatus(u)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition inline-flex items-center gap-1 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                                u.enabled
                                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >
                              {u.enabled ? (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Lock Account</span>
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Enable Account</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "hr_audit" && <HROperationsAudit />}

{activeTab === "attendance" && <LiveAttendanceMonitor />}

{activeTab === "employee_watch" && <EmployeeActivityWatch />}

          {/* ================= OPTION 2: SYSTEM TELEMETRY ================= */}
          {activeTab === "services" && (
            <div className="space-y-6">
              {/* Microservices Node Grid */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 style={display} className="text-xl sm:text-2xl text-[#061B33] uppercase">
                    Microservices Architecture Nodes
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Eureka Discovery Registered Spring Cloud Services.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "API-GATEWAY", port: "8090", status: "UP", desc: "Edge routing, Cors & JWT Filters", ping: "2ms" },
                    { name: "AUTH-SERVICE", port: "8091", status: "UP", desc: "User Accounts & JWT Validation", ping: "4ms" },
                    { name: "EMPLOYEE-SERVICE", port: "8092", status: "UP", desc: "Staff Registry & Department Profiles", ping: "5ms" },
                    { name: "ATTENDANCE-SERVICE", port: "8093", status: "UP", desc: "Punch In/Out & Shift Records", ping: "3ms" },
                    { name: "LEAVE-SERVICE", port: "8094", status: "UP", desc: "Workflow Approvals & Balance Tracking", ping: "6ms" },
                    { name: "PAYROLL-SERVICE", port: "8095", status: "STANDBY", desc: "Compensation & Batch Calculations", ping: "12ms" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between h-36 hover:bg-slate-100/60 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-xs text-slate-900">{s.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">:{s.port}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">{s.desc}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            s.status === "UP" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-200/60">
                        <span>LATENCY: {s.ping}</span>
                        <span className="text-emerald-600 font-bold">HEALTHY</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infrastructure Nodes (MySQL, Redis, RabbitMQ) */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 style={display} className="text-xl sm:text-2xl text-[#061B33] uppercase">
                    Backing Infrastructure Nodes
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Databases, cache layer, and event brokers.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">MySQL 8.4 Server</p>
                      <p className="text-[10px] font-mono text-slate-500">hrgenius-mysql:3307</p>
                      <span className="text-[10px] text-emerald-600 font-bold">CONNECTED</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Redis Cache Node</p>
                      <p className="text-[10px] font-mono text-slate-500">localhost:6379</p>
                      <span className="text-[10px] text-emerald-600 font-bold">TOKEN BLACKLIST ACTIVE</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">RabbitMQ Broker</p>
                      <p className="text-[10px] font-mono text-slate-500">hrgenius.exchange</p>
                      <span className="text-[10px] text-emerald-600 font-bold">EVENT BUS READY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= OPTION 3: SECURITY AUDIT LOGS ================= */}
          {activeTab === "audit" && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 style={display} className="text-xl sm:text-2xl text-[#061B33] uppercase">
                    Security & Event Audit Trail
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Immutable activity log tracking security alterations and user state mutations.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold">
                  {auditLogs.length} Events Logged
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[550px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[10px] tracking-wider pb-3">
                      <th className="pb-3">Event Type</th>
                      <th className="pb-3">Action Description</th>
                      <th className="pb-3">Operator</th>
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3 text-right">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 font-mono font-bold text-slate-900">
                          {log.event}
                        </td>
                        <td className="py-4 text-slate-600">{log.detail}</td>
                        <td className="py-4">
                          <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            @{log.performedBy}
                          </span>
                        </td>
                        <td className="py-4 text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{log.time}</span>
                        </td>
                        <td className="py-4 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                              log.severity === "SUCCESS"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.severity === "WARN"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Provision User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F6F8FB]">
              <div>
                <h3 style={display} className="text-xl uppercase tracking-wide text-[#061B33]">
                  Provision System User
                </h3>
                <p className="text-[11px] font-semibold text-slate-400">
                  Direct Auth-Service Enrollment
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="e.g. hrtwo"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@hrgenius.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••••••"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Assign System Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="HR_MANAGER">HR_MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="RECRUITER">RECRUITER</option>
                  <option value="PAYROLL_OFFICER">PAYROLL_OFFICER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-[#061B33] text-white text-xs font-bold hover:bg-slate-800 transition shadow-md disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 text-[#E6FB3F]" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}