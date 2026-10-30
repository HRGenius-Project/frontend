import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Plus,
  Check,
  Mail,
  MapPin,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Design tokens (colors + fonts picked from the reference)                  */
/* -------------------------------------------------------------------------- */

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
  fontFamily:
    "'Anton', 'Bebas Neue', Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
  letterSpacing: "0.02em",
};
const bodyFont = {
  fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, -apple-system, sans-serif",
};

const MODULES = [
  { title: "Recruitment", text: "Post jobs, track applicants and schedule interviews on one board.", bg: C.orange },
  { title: "Attendance", text: "Live check-ins, shifts and late marks across every office.", bg: C.purple },
  { title: "Organization", text: "Departments, reporting lines and roles that stay up to date.", bg: C.coral },
  { title: "Payroll & Slips", text: "Salary runs, deductions and payslips sent without chasing.", bg: C.coral },
  { title: "Leave management", text: "Balances, holidays and approvals handled from any phone.", bg: C.green },
  { title: "Reports & analytics", text: "Headcount, attrition and overtime in dashboards that refresh.", bg: C.navy },
];

const METHOD = [
  {
    title: "Import your people",
    text: "Upload a CSV or connect your old system. Departments and managers are mapped for you.",
    bg: C.orange,
  },
  {
    title: "Set your policies",
    text: "Add leave types, shift rules and salary structures once, and they apply to everyone.",
    bg: C.purple,
  },
  {
    title: "Invite your team",
    text: "Employees get a login link and can check in and apply for leave the same day.",
    bg: C.coral,
  },
  {
    title: "Run payroll",
    text: "Review the summary, approve it, and payslips reach every inbox.",
    bg: C.green,
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "₹99",
    note: "per employee / month",
    items: ["Up to 50 employees", "Attendance & leave", "Payslip generation"],
    bg: C.purple,
    text: "#fff",
  },
  {
    name: "Growth",
    price: "₹179",
    note: "per employee / month",
    items: ["Unlimited employees", "Recruitment pipeline", "Approval workflows", "People analytics"],
    bg: C.orange,
    text: "#fff",
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "talk to our team",
    items: ["Single sign-on", "Dedicated environment", "Audit & compliance reports"],
    bg: C.navy,
    text: "#fff",
  },
];

/* -------------------------------------------------------------------------- */
/*  Notch: the cut-out corner that gives the cards their shape                */
/*  `bg` must match the color behind the card so the notch looks transparent. */
/* -------------------------------------------------------------------------- */

function Notch({ corner = "tr", size = 52, r = 18, bg = C.white, children }) {
  const tr = corner === "tr";
  const grad = `radial-gradient(circle at ${tr ? "0 100%" : "100% 0"}, transparent ${r}px, ${bg} ${r + 0.5}px)`;

  const block = tr
    ? { top: 0, right: 0, borderBottomLeftRadius: r + 2 }
    : { bottom: 0, left: 0, borderTopRightRadius: r + 2 };

  const pieceA = tr
    ? { top: 0, right: size, width: r, height: r }
    : { bottom: size, left: 0, width: r, height: r };
  const pieceB = tr
    ? { top: size, right: 0, width: r, height: r }
    : { bottom: 0, left: size, width: r, height: r };

  return (
    <>
      <div
        className="absolute z-10 grid place-items-center"
        style={{ ...block, width: size, height: size, background: bg }}
      >
        {children}
      </div>
      <div className="pointer-events-none absolute z-10" style={{ ...pieceA, background: grad }} />
      <div className="pointer-events-none absolute z-10" style={{ ...pieceB, background: grad }} />
    </>
  );
}

function ArrowDot({ color = C.navy, className = "" }) {
  return (
    <span
      className={`grid h-9 w-9 place-items-center rounded-full bg-white ${className}`}
      style={{ color }}
    >
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}

function StatCard({ value, label, bg, text = "#fff", pageBg, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] p-4 pr-16 ${className}`}
      style={{ background: bg, color: text }}
    >
      <Notch corner="tr" size={44} r={14} bg={pageBg}>
        <ArrowUpRight className="h-4 w-4" style={{ color: bg === C.lime || bg === C.green ? bg : bg }} strokeWidth={2.5} />
      </Notch>
      <p style={display} className="text-3xl leading-none tracking-wide">
        {value}
      </p>
      <p className="mt-2 max-w-[9rem] text-[11px] leading-snug opacity-90">{label}</p>
    </div>
  );
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="HRGenius home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FF3B30] text-lg font-black text-white">
        H
      </span>
      <span className="text-lg font-black tracking-tight text-white">
        HR<span className="text-[#FF3B30]">GENIUS</span>
      </span>
    </a>
  );
}

function Eyebrow({ children }) {
  return (
    <p style={{ ...display, color: C.coral }} className="text-sm uppercase tracking-wider">
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/*  Decorative stickers (inline SVG)                                          */
/* -------------------------------------------------------------------------- */

function Spiral({ className = "" }) {
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true">
      <g fill={C.orange} stroke="#9A4A00" strokeWidth="1.5">
        <rect x="6" y="6" width="44" height="14" rx="7" transform="rotate(-8 28 13)" />
        <rect x="10" y="26" width="44" height="14" rx="7" transform="rotate(6 32 33)" />
        <rect x="6" y="46" width="44" height="14" rx="7" transform="rotate(-8 28 53)" />
        <rect x="12" y="64" width="40" height="12" rx="6" transform="rotate(5 32 70)" />
      </g>
    </svg>
  );
}

function Star({ className = "", color = C.lime }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1.5l3 7.2 7.5.6-5.7 4.9 1.8 7.3L12 17.5 5.4 21.5l1.8-7.3L1.5 9.3l7.5-.6z"
        fill={color}
        stroke="#0a0a0a"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Flower({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill={C.purple} stroke={C.lime} strokeWidth="4" strokeDasharray="3 5" />
      <circle cx="32" cy="32" r="16" fill={C.lime} />
      <circle cx="32" cy="32" r="7" fill={C.purple} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const navigate = useNavigate();

  // Google Fonts inject
  useEffect(() => {
    const id = "hrgenius-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.href =
        "https://fonts.googleapis.com/css2?family=Anton&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div id="top" className="min-h-screen bg-white text-slate-900 antialiased" style={bodyFont}>
      {/* ================================ HERO ================================ */}
      <section className="relative overflow-hidden pb-28 text-white" style={{ background: C.navy }}>
        <nav className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Logo />
          <ul className="hidden items-center gap-8 text-xs text-white/80 md:flex">
            <li><a href="#modules" className="hover:text-white">Modules</a></li>
            <li><a href="#why" className="hover:text-white">Why us</a></li>
            <li><a href="#method" className="hover:text-white">Method</a></li>
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
          </ul>
          <button
            onClick={handleLoginRedirect}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 cursor-pointer"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </nav>

        <div className="relative mx-auto max-w-4xl px-4 pt-10 text-center sm:pt-14">
          <p className="inline-flex items-center gap-2 text-xs text-white/90">
            <Heart className="h-3.5 w-3.5 fill-[#FF5740] text-[#FF5740]" />
            #1 HR platform for growing teams
          </p>

          <div className="relative mt-5">
            {/* stickers */}
            <Spiral className="absolute -left-2 top-0 hidden h-16 w-12 -rotate-12 sm:block lg:-left-14" />
            <Star className="absolute left-4 top-24 hidden h-6 w-6 sm:block lg:left-0" />
            <Flower className="absolute -right-2 -top-4 hidden h-14 w-14 rotate-12 sm:block lg:-right-12" />
            <Star className="absolute -right-2 top-32 hidden h-5 w-5 sm:block lg:-right-8" color="#7DD3FC" />
            <span className="absolute left-12 top-0 hidden text-2xl font-black text-sky-300 sm:block lg:-left-24">+</span>

            <h1
              style={display}
              className="text-[2.9rem] uppercase leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.4rem]"
            >
              <span className="block">Power your</span>
              <span className="flex flex-wrap items-center justify-center gap-x-3">
                <span style={{ color: C.purple }}>People into</span>
                <span
                  className="inline-grid h-10 w-14 -rotate-6 place-items-center rounded-md bg-black text-[9px] leading-none tracking-widest text-white ring-1 ring-white/20 sm:h-16 sm:w-24 sm:text-xs"
                  aria-hidden="true"
                >
                  <span className="text-center">
                    EMP
                    <br />
                    <span style={{ color: C.lime }}>#0007</span>
                  </span>
                </span>
                <span style={{ color: C.orange }}>Growth</span>
              </span>
              <span className="block">Effortlessly</span>
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-white/75 sm:text-sm">
            Hiring, attendance, leave and payroll in one workspace, designed so your team can
            focus on people instead of paperwork.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-slate-900 cursor-pointer"
          >
            Get in touch <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* proof row */}
        <div className="relative mx-auto mt-14 grid max-w-4xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative pt-8">
            <span
              className="absolute left-0 top-0 -rotate-6 rounded-full px-3 py-1 text-[10px] font-bold text-slate-900"
              style={{ background: C.orange }}
            >
              Faster hiring
            </span>
            <span
              className="absolute left-24 top-1 rotate-3 rounded-full px-3 py-1 text-[10px] font-bold text-white"
              style={{ background: C.coral }}
            >
              Fewer errors
            </span>
            <span
              className="absolute left-14 top-5 -rotate-2 rounded-full px-3 py-1 text-[10px] font-bold text-slate-900"
              style={{ background: C.lime }}
            >
              Live attendance
            </span>
            <p style={display} className="mt-8 text-2xl uppercase leading-tight sm:text-3xl">
              5x faster payroll runs. <span className="text-white/45">Average drop in manual HR work for our clients.</span>
            </p>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard value="350+" label="Companies onboarded across industries" bg={C.green} pageBg={C.navy} />
              <StatCard value="67%" label="Less admin time on average" bg={C.lime} text={C.navy} pageBg={C.navy} />
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-white/60">
              Helping teams grow with one employee record and clear approvals.
            </p>
          </div>
        </div>

        {/* bump at the bottom edge */}
        <div className="absolute bottom-0 left-1/2 h-10 w-24 -translate-x-1/2 rounded-t-[40px] bg-white" aria-hidden="true" />
      </section>

      {/* ============================== MODULES ============================== */}
      <section id="modules" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-20 sm:px-6">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow>Our modules!</Eyebrow>
            <h2 style={{ ...display, color: C.navy }} className="mt-2 text-4xl uppercase leading-[1.02] sm:text-5xl">
              Modules designed to run your people
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 md:max-w-xs md:justify-self-end">
            Every module shares one employee record, so nothing gets entered twice and every
            number matches.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <article
              key={m.title}
              onClick={handleLoginRedirect}
              className="relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[26px] p-6 text-white transition duration-200 hover:-translate-y-1 cursor-pointer"
              style={{ background: m.bg }}
            >
              <Notch corner="tr" size={52} r={18} bg={C.white} />
              <Notch corner="bl" size={26} r={12} bg={C.white} />
              <div className="pr-10">
                <h3 style={display} className="text-2xl uppercase leading-tight">
                  {m.title}
                </h3>
                <p className="mt-3 max-w-[15rem] text-xs leading-relaxed text-white/80">{m.text}</p>
              </div>
              <ArrowDot color={m.bg === C.navy ? C.coral : m.bg} className="self-end" />
            </article>
          ))}
        </div>
      </section>

      {/* ================================ WHY ================================ */}
      <section id="why" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-20 sm:px-6">
        <div className="grid items-end gap-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow>Why choose us!</Eyebrow>
            <h2 style={{ ...display, color: C.navy }} className="mt-2 text-4xl uppercase leading-[1.02] sm:text-5xl">
              Why HRGenius is the trusted choice
            </h2>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 md:max-w-xs md:justify-self-end">
            Built with HR teams who were tired of spreadsheets, and tested on companies from 20
            to 2,000 people.
          </p>
        </div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_340px_1fr]">
          {/* left */}
          <div className="lg:text-right">
            <h3 style={{ ...display, color: C.navy }} className="text-lg uppercase">
              Proven expertise
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 lg:ml-auto lg:max-w-[16rem]">
              Years of running payroll and attendance for real companies, built into the product.
            </p>
            <StatCard
              value="300+"
              label="Successful rollouts across industries"
              bg={C.purple}
              pageBg={C.white}
              className="mt-5 w-44 lg:ml-auto"
            />
          </div>

          {/* center: dashboard mock */}
          <div
            className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-[28px] p-6 text-white"
            style={{ background: C.navy }}
          >
            <Notch corner="tr" size={48} r={16} bg={C.white} />
            <Notch corner="bl" size={32} r={14} bg={C.white} />
            <p className="text-[11px] text-white/60">Live HR dashboard</p>
            <p style={display} className="mt-1 text-4xl tracking-wide">
              1,248
            </p>
            <p className="text-[11px] text-white/60">active employees</p>

            <div className="mt-6 flex h-28 items-end gap-2" aria-hidden="true">
              {[
                [55, C.purple],
                [80, C.orange],
                [45, C.coral],
                [95, C.green],
                [70, C.lime],
                [60, C.purple],
                [88, C.orange],
              ].map(([h, c], i) => (
                <span key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: c }} />
              ))}
            </div>

            <ul className="mt-6 space-y-3 text-xs">
              {[
                ["Present today", "1,172", C.green],
                ["On leave", "54", C.orange],
                ["Late check-ins", "22", C.coral],
              ].map(([l, v, c]) => (
                <li key={l} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: c }} />
                    {l}
                  </span>
                  <span className="font-bold">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* right */}
          <div>
            <h3 style={{ ...display, color: C.navy }} className="text-lg uppercase">
              Data-driven approach
            </h3>
            <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-slate-600">
              Decisions on hiring, shifts and payroll come from live numbers, not month-old exports.
            </p>
            <StatCard
              value="200%"
              label="Faster approvals on average"
              bg={C.coral}
              pageBg={C.white}
              className="mt-5 w-44"
            />
          </div>
        </div>
      </section>

      {/* ============================== METHOD ============================== */}
      <section id="method" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-20 sm:px-6">
        <Eyebrow>How we work</Eyebrow>
        <h2 style={{ ...display, color: C.navy }} className="mt-2 text-4xl uppercase leading-[1.02] sm:text-5xl">
          Our working method
        </h2>

        <ol className="mt-10 space-y-4">
          {METHOD.map((s, i) => (
            <li
              key={s.title}
              className="relative grid items-center gap-4 overflow-hidden rounded-[26px] p-6 pr-20 text-white sm:grid-cols-[auto_1fr_1fr] sm:gap-8 sm:p-8 sm:pr-24"
              style={{ background: s.bg }}
            >
              <Notch corner="tr" size={56} r={18} bg={C.white}>
                <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: C.navy }}>
                  <Plus className="h-4 w-4 text-white" />
                </span>
              </Notch>
              <span style={display} className="text-6xl leading-none sm:text-7xl">
                {i + 1}
              </span>
              <h3 style={display} className="text-2xl uppercase leading-tight sm:text-3xl">
                {s.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/85 sm:text-sm">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============================== PRICING ============================== */}
      <section id="pricing" className="mx-auto max-w-6xl scroll-mt-4 px-4 pb-20 sm:px-6">
        <Eyebrow>Pricing</Eyebrow>
        <h2 style={{ ...display, color: C.navy }} className="mt-2 text-4xl uppercase leading-[1.02] sm:text-5xl">
          Pay for the people you manage
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.name}
              className="relative flex flex-col overflow-hidden rounded-[26px] p-7 transition duration-200 hover:-translate-y-1"
              style={{ background: p.bg, color: p.text }}
            >
              <Notch corner="tr" size={52} r={18} bg={C.white} />
              <h3 style={display} className="text-2xl uppercase">
                {p.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span style={display} className="text-5xl">
                  {p.price}
                </span>
                <span className="text-xs text-white/75">{p.note}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-xs">
                {p.items.map((it) => (
                  <li key={it} className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 shrink-0" strokeWidth={3} />
                    {it}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleLoginRedirect}
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold cursor-pointer"
                style={{ color: p.bg === C.navy ? C.navy : p.bg }}
              >
                {p.name === "Enterprise" ? "Talk to sales" : "Start hosting"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ================================ CTA ================================ */}
      <section id="cta" className="px-4 pb-20 sm:px-6">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-6 py-16 text-center text-white sm:py-20"
          style={{ background: C.navy }}
        >
          <Notch corner="tr" size={64} r={20} bg={C.white} />
          <Notch corner="bl" size={40} r={16} bg={C.white} />
          <h2 style={display} className="mx-auto max-w-3xl text-4xl uppercase leading-[1.02] sm:text-6xl">
            Ready to run your <span style={{ color: C.orange }}>people</span> better?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-white/70">
            Import your employees today and run your first attendance cycle this week.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleLoginRedirect}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold text-slate-900 cursor-pointer"
              style={{ background: C.lime }}
            >
              Start hosting <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
              href="mailto:hello@hrgenius.app"
              className="inline-flex items-center rounded-full bg-white/10 px-6 py-3 text-xs font-bold ring-1 ring-white/20 hover:bg-white/20"
            >
              Book a demo
            </a>
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer style={{ background: C.navy }} className="text-white">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center">
          <div>
            <Logo />
            <p className="mt-4 flex items-center gap-2 text-xs text-white/60">
              <MapPin className="h-4 w-4" /> Gurugram, India
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-white/60">
              <Mail className="h-4 w-4" /> hello@hrgenius.app
            </p>
          </div>
          <ul className="flex flex-wrap gap-6 text-xs text-white/70">
            <li><a href="#modules" className="hover:text-white">Modules</a></li>
            <li><a href="#why" className="hover:text-white">Why us</a></li>
            <li><a href="#method" className="hover:text-white">Method</a></li>
            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
            <li>
              <button onClick={handleLoginRedirect} className="hover:text-white cursor-pointer">
                Login
              </button>
            </li>
          </ul>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-[11px] text-white/50">
          © {new Date().getFullYear()} HRGenius. All rights reserved.
        </div>
      </footer>
    </div>
  );
}