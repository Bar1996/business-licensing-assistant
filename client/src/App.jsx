import { useMemo, useState } from "react";

// 👉 עדכן אם שינית פורט/בסיס
const API_BASE = "http://localhost:3000";

async function api(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export default function App() {
  const [answers, setAnswers] = useState({
    seats: 0,
    areaM2: 0,
    servesAlcohol: false,
    usesGas: false,
  });
  const [matched, setMatched] = useState([]);
  const [report, setReport] = useState("");
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState("");

  const isReady = useMemo(
    () => answers.areaM2 > 0 && answers.seats >= 0,
    [answers]
  );

  function onChange(e) {
    const { name, type, checked, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  }

  async function handleMatch() {
    setError("");
    setLoadingMatch(true);
    try {
      const data = await api("/requirements/match", answers);
      setMatched(data.matched || []);
    } catch (e) {
      setError(e.message || "Match failed");
    } finally {
      setLoadingMatch(false);
    }
  }

  async function handleReport() {
    setError("");
    setLoadingReport(true);
    try {
      const data = await api("/report", answers);
      setReport(data.report || "");
      // אופציונלי: גלילה לדוח
      document.getElementById("report")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setError(e.message || "Report failed");
    } finally {
      setLoadingReport(false);
    }
  }

  function copyReport() {
    if (!report) return;
    navigator.clipboard.writeText(report);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-zinc-100">
      <header className="border-b border-white/10 backdrop-blur sticky top-0 z-10 bg-black/30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
            Business Licensing Assistant
          </h1>
          <div className="text-xs text-zinc-400">React + Tailwind • Node API</div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM CARD */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl p-6 md:p-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-6 text-zinc-200">
            Fill in Business Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Seats</span>
              <input
                type="number"
                name="seats"
                value={answers.seats}
                onChange={onChange}
                className="w-full rounded-xl bg-white text-zinc-900 px-3 py-2 shadow-inner outline-none ring-2 ring-transparent focus:ring-indigo-400 transition"
                min={0}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">Area (m²)</span>
              <input
                type="number"
                name="areaM2"
                value={answers.areaM2}
                onChange={onChange}
                className="w-full rounded-xl bg-white text-zinc-900 px-3 py-2 shadow-inner outline-none ring-2 ring-transparent focus:ring-indigo-400 transition"
                min={0}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="servesAlcohol"
                checked={answers.servesAlcohol}
                onChange={onChange}
                className="size-4 accent-indigo-500"
              />
              <span className="text-sm">Serves Alcohol</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="usesGas"
                checked={answers.usesGas}
                onChange={onChange}
                className="size-4 accent-indigo-500"
              />
              <span className="text-sm">Uses Gas</span>
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleMatch}
              disabled={!isReady || loadingMatch}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-40 px-5 py-2.5 font-medium shadow-lg shadow-indigo-900/30 transition-transform hover:-translate-y-0.5"
            >
              {loadingMatch ? (
                <span className="loader size-4" />
              ) : (
                <span>Match Requirements</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleReport}
              disabled={!isReady || loadingReport}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 disabled:opacity-40 px-5 py-2.5 font-medium shadow-lg shadow-emerald-900/30 transition-transform hover:-translate-y-0.5"
            >
              {loadingReport ? <span className="loader size-4" /> : <span>Generate Report</span>}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-400 bg-rose-950/40 border border-rose-700/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </section>

        {/* RESULTS CARD */}
        <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl p-6 md:p-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 text-zinc-200">Matched Requirements</h2>

          {matched.length === 0 ? (
            <p className="text-sm text-zinc-400">No matches yet. Fill the form and click <b>Match Requirements</b>.</p>
          ) : (
            <ul className="space-y-3">
              {matched.map((req) => (
                <li
                  key={req.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium text-indigo-300">{req.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-indigo-500/15 text-indigo-300 px-3 py-1 text-xs border border-indigo-500/30">
                        {req.authority}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs border ${
                          req.priority === "high"
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : req.priority === "medium"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        }`}
                      >
                        Priority: {req.priority}
                      </span>
                    </div>
                  </div>

                  {req.steps?.length > 0 && (
                    <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-zinc-300">
                      {req.steps.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* REPORT CARD */}
        <section id="report" className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl p-6 md:p-8 animate-fade-in">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-zinc-200">Report</h2>
            <button
              type="button"
              onClick={copyReport}
              disabled={!report}
              className="rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 disabled:opacity-40 px-3 py-1.5 text-sm"
            >
              Copy
            </button>
          </div>

          {report ? (
            <pre className="whitespace-pre-wrap leading-relaxed text-zinc-200">
              {report}
            </pre>
          ) : (
            <p className="text-sm text-zinc-400">No report yet. Click <b>Generate Report</b> to create one.</p>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-zinc-500">
        Prototype • Not legal advice. Verify with authorities.
      </footer>
    </div>
  );
}
