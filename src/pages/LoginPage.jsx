import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosClient from "../api/axiosClient";
import { jwtDecode } from "jwt-decode";

/* ---------------------------------------------------------------------------
   Colors + fonts (landing page wale hi)
--------------------------------------------------------------------------- */
const C = {
  navy: "#061B33",
  orange: "#FB9A1E",
  purple: "#A58BFA",
  coral: "#FF5740",
  green: "#20B685",
  lime: "#E6FB3F",
  white: "#FFFFFF",
  blob: "#E8EEFB",
};

const display = {
  fontFamily: "'Barlow Condensed', 'Oswald', Impact, sans-serif",
  fontWeight: 800,
};
const bodyFont = { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };

const LOGIN_IMAGES = [
  "/Login.png",
  "/Login.jpg",
  "/Login.jpeg",
  "/Login.svg",
  "/Login.webp",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-900 " +
  "placeholder:text-slate-400 transition focus:border-[#061B33] focus:outline-none focus:ring-2 focus:ring-[#061B33]/10";

function Leaves({ className = "" }) {
  return (
    <svg viewBox="0 0 90 110" className={className} aria-hidden="true">
      <path
        d="M70 108 C 60 80 40 60 28 38"
        stroke="#64748B"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M70 108 C 72 80 78 60 84 32"
        stroke="#94A3B8"
        strokeWidth="1.5"
        fill="none"
      />
      {[
        [30, 40],
        [36, 56],
        [46, 70],
        [24, 54],
      ].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="6"
          ry="10"
          fill={C.purple}
          opacity="0.75"
          transform={`rotate(-25 ${x} ${y})`}
        />
      ))}
      {[
        [82, 34],
        [78, 52],
        [74, 70],
      ].map(([x, y], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="5"
          ry="9"
          fill="#94A3B8"
          opacity="0.7"
          transform={`rotate(20 ${x} ${y})`}
        />
      ))}
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const id = "hrgenius-fonts-v2";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        username: email.trim(),
        password: password,
      };

      const response = await axiosClient.post("/api/auth/login", payload);
      const data = response.data;
      const token = data.accessToken || data.token;

      if (!token) {
        throw new Error("Response me accessToken nahi mila!");
      }

      // JWT Decode
      const decoded = jwtDecode(token);
      console.log("Decoded Token Claims:", decoded);

      let extractedRoles = [];
      if (Array.isArray(decoded.roles)) {
        extractedRoles = decoded.roles;
      } else if (typeof decoded.role === "string") {
        extractedRoles = [decoded.role];
      } else if (Array.isArray(decoded.authorities)) {
        extractedRoles = decoded.authorities.map((a) =>
          typeof a === "string" ? a : a.authority
        );
      }

      // Clean prefix "ROLE_"
      const cleanedRoles = extractedRoles.map((r) =>
        String(r).replace("ROLE_", "").toUpperCase()
      );

      // Determine main app role
      let cleanRole = "EMPLOYEE";
      if (cleanedRoles.includes("ADMIN")) {
        cleanRole = "ADMIN";
      } else if (
        cleanedRoles.includes("HR_MANAGER") ||
        cleanedRoles.includes("HR") ||
        cleanedRoles.includes("RECRUITER")
      ) {
        cleanRole = "HR";
      } else {
        cleanRole = "EMPLOYEE";
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("hrgenius_token", token);
      if (data.refreshToken) {
        storage.setItem("hrgenius_refresh_token", data.refreshToken);
      }
      storage.setItem("hrgenius_role", cleanRole);
      storage.setItem("hrgenius_raw_roles", JSON.stringify(cleanedRoles));
      storage.setItem("hrgenius_user", JSON.stringify(decoded));

      // Redirect based on role
      if (cleanRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (cleanRole === "HR") {
        navigate("/hr/dashboard");
      } else {
        navigate("/employee/portal");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response) {
        const msg =
          err.response.data?.message ||
          err.response.data?.error ||
          (typeof err.response.data === "string" ? err.response.data : null) ||
          "Invalid email/username or password";
        setErrorMsg(typeof msg === "string" ? msg : "Authentication failed");
      } else {
        setErrorMsg(
          "Gateway connection error! CORS ya API-Gateway running check karo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#F4F7FC] p-4 sm:p-8"
      style={bodyFont}
    >
      <div className="relative flex min-h-[640px] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(6,27,51,0.10)] lg:flex-row">
        {/* ===== Right side curvy blob ===== */}
        <svg
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[58%] lg:block"
          viewBox="0 0 500 650"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill={C.blob}
            d="M130 0 H500 V650 H30 C5 610 -5 560 20 500 C45 440 70 400 60 330 C52 270 5 230 5 170 C5 100 90 40 130 0 Z"
          />
        </svg>

        {/* ===== LEFT: Logo + Illustration ===== */}
        <div className="relative z-10 flex flex-col p-8 sm:p-12 lg:w-1/2">
          <div
            className="flex cursor-pointer items-center gap-2.5"
            onClick={() => navigate("/")}
          >
            <span
              style={display}
              className="grid h-9 w-9 place-items-center rounded-xl bg-[#FF3B30] text-xl text-white"
            >
              H
            </span>
            <span
              style={{ ...display, color: C.navy }}
              className="text-2xl tracking-wide"
            >
              HR<span className="text-[#FF3B30]">GENIUS</span>
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            {imgIdx < LOGIN_IMAGES.length ? (
              <img
                src={LOGIN_IMAGES[imgIdx]}
                onError={() => setImgIdx((i) => i + 1)}
                alt="HRGenius login illustration"
                className="h-auto w-full max-w-[440px] select-none object-contain"
                draggable={false}
              />
            ) : (
              <p className="text-xs text-slate-400">
                Add your image as public/Login.png
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ShieldCheck className="h-4 w-4 text-[#20B685]" />
            <span>Encrypted SSO & Gateway JWT Protocol</span>
          </div>
        </div>

        {/* ===== RIGHT: Form ===== */}
        <div className="relative z-10 flex items-center bg-[#E8EEFB] p-8 sm:p-12 lg:w-1/2 lg:bg-transparent lg:pl-20 lg:pr-14">
          <div className="mx-auto w-full max-w-sm">
            <h2
              style={{ ...display, color: C.navy }}
              className="text-5xl uppercase leading-none sm:text-6xl"
            >
              Login
            </h2>
            <p className="mb-7 mt-2 text-xs font-medium text-slate-500">
              Enter your workspace credentials to access your portal.
            </p>

            {errorMsg && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3.5 text-xs font-semibold text-rose-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1.5 ml-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Email / Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={inputClass}
                  />
                  <Mail className="absolute right-4 top-4 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 ml-1 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex cursor-pointer select-none items-center gap-2 font-medium text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#061B33] focus:ring-0"
                  />
                  Remember Me
                </label>
                <a
                  href="#forgot"
                  className="font-bold text-[#061B33] transition-colors hover:text-[#FF5740]"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition hover:scale-[1.01] active:scale-95 disabled:opacity-70"
                style={{ background: C.navy }}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300/60" />
              </div>
              <span className="relative bg-[#E8EEFB] px-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:bg-transparent">
                <span className="rounded bg-[#E8EEFB] px-1">
                  Or you can join with
                </span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:border-slate-300 active:scale-95"
              >
                G
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0077B5] text-xs font-bold text-white transition hover:opacity-90 active:scale-95"
              >
                in
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white transition hover:opacity-90 active:scale-95"
                style={{ background: C.navy }}
              >
                SSO
              </button>
            </div>

            <p className="mt-7 text-center text-xs font-medium text-slate-500">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/#pricing")}
                className="font-bold text-[#FF5740] hover:underline"
              >
                Register Now
              </button>
            </p>
          </div>
        </div>

        <Leaves className="pointer-events-none absolute bottom-3 right-4 z-10 hidden h-24 w-20 lg:block" />
      </div>
    </div>
  );
}