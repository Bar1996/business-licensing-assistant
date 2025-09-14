import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html2pdf from "html2pdf.js";

// עדכן אם שינית פורט/בסיס
const API_BASE = "http://localhost:3000";

async function api(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`שגיאת שרת: ${res.status}`);
  return res.json();
}

export default function App() {
  const [answers, setAnswers] = useState({
    businessName: "",
    seats: 0,
    areaM2: 0,
    servesAlcohol: false,
    usesGas: false,
    deliveries: false,
    servesMeat: false,
  });

  const [matched, setMatched] = useState([]);
  const [report, setReport] = useState("");
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState("");
  const reportRef = useRef(null);

  // ניראות הדוח: המרה של <br> לירידת שורה Markdown
  const mdReport = useMemo(
    () => (report ? report.replace(/<br\s*\/?>/gi, "  \n") : ""),
    [report]
  );

  const isReady = useMemo(
    () => Number(answers.areaM2) > 0 && Number(answers.seats) >= 0,
    [answers]
  );

  function onChange(e) {
    const { name, type, checked, value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "businessName"
          ? value
          : Number(value),
    }));
  }

  async function handleMatch() {
    setError("");
    setLoadingMatch(true);
    try {
      const data = await api("/requirements/match", answers);
      setMatched(data.matched || []);
    } catch (e) {
      setError(e.message || "השוואת דרישות נכשלה");
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
      document.getElementById("report")?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      setError(e.message || "יצירת דוח נכשלה");
    } finally {
      setLoadingReport(false);
    }
  }

  function copyReport() {
    if (!report) return;
    navigator.clipboard.writeText(report);
  }

  function downloadPdf() {
    if (!reportRef.current) return;
    const filename = `business-licensing-report-${(
      answers.businessName || "report"
    )
      .replace(/\s+/g, "-")
      .toLowerCase()}.pdf`;
    html2pdf()
      .set({
        margin: [0.5, 0.5],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-zinc-100"
    >
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="w-full pr-2 pl-4 sm:pr-4 sm:pl-6 lg:pr-8 lg:pl-8 py-4 flex items-center justify-start">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
            עוזר רישוי עסקים
          </h1>
        </div>
      </header>

      {/* LAYOUT */}
      <main className="mx-auto max-w-screen-2xl pr-2 pl-4 sm:pr-4 sm:pl-6 lg:pr-8 lg:pl-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* FORM */}
        <section className="lg:col-span-5 min-w-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl p-6 md:p-8 animate-fade-in">
          <h2 className="text-lg font-semibold mb-6 text-zinc-200">
            פרטי העסק
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm text-zinc-400">שם העסק</span>
              <input
                type="text"
                name="businessName"
                value={answers.businessName}
                onChange={onChange}
                placeholder="לדוגמה: מסעדת הרצל"
                className="w-full rounded-xl bg-white text-zinc-900 px-3 py-2 shadow-inner outline-none ring-2 ring-transparent focus:ring-indigo-400 transition"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm text-zinc-400">מקומות ישיבה</span>
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
              <span className="text-sm text-zinc-400">שטח (מ״ר)</span>
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
              <span className="text-sm">מגיש אלכוהול</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="usesGas"
                checked={answers.usesGas}
                onChange={onChange}
                className="size-4 accent-indigo-500"
              />
              <span className="text-sm">שימוש בגז</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="deliveries"
                checked={answers.deliveries}
                onChange={onChange}
                className="size-4 accent-indigo-500"
              />
              <span className="text-sm">מבצע משלוחים</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="servesMeat"
                checked={answers.servesMeat}
                onChange={onChange}
                className="size-4 accent-indigo-500"
              />
              <span className="text-sm">מגיש בשר</span>
            </label>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleMatch}
              disabled={!isReady || loadingMatch}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-xl 
               bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 
               disabled:opacity-40 px-5 py-2.5 font-medium shadow-lg shadow-indigo-900/30 
               transition-transform hover:-translate-y-0.5"
            >
              {loadingMatch ? (
                <span className="loader size-4" />
              ) : (
                <span>התאם דרישות</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleReport}
              disabled={!isReady || loadingReport}
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-xl 
               bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 
               disabled:opacity-40 px-5 py-2.5 font-medium shadow-lg shadow-emerald-900/30 
               transition-transform hover:-translate-y-0.5"
            >
              {loadingReport ? (
                <span className="loader size-4" />
              ) : (
                <span>צור דוח</span>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-rose-300 bg-rose-950/40 border border-rose-700/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </section>

        {/* MATCHED */}
        <section className="lg:col-span-7 min-w-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl p-6 md:p-8 animate-fade-in flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-zinc-200">
            התאמות שנמצאו
          </h2>

          <div className="overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-transparent">

            {matched.length === 0 ? (
              <p className="text-sm text-zinc-400">
                אין התאמות עדיין. מלא את הטופס ולחץ <b>התאם דרישות</b>.
              </p>
            ) : (
              <ul className="space-y-4">
                {matched.map((req) => (
                  <li
                    key={req.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium text-indigo-300">
                        {req.title}
                      </div>
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
                          עדיפות: {req.priority}
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
          </div>
        </section>

        {/* REPORT */}
        <section
          id="report"
          className="scroll-mt-24 lg:col-span-12 min-w-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl p-6 md:p-8 animate-fade-in"
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold text-zinc-200">דוח</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyReport}
                disabled={!report}
                className="rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 disabled:opacity-40 px-3 py-1.5 text-sm"
              >
                העתק דוח
              </button>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={!report}
                className="rounded-lg border border-white/10 bg-white/10 hover:bg-white/20 disabled:opacity-40 px-3 py-1.5 text-sm"
              >
                הורד PDF
              </button>
            </div>
          </div>

          {/* תגים מסכמים */}
          {matched.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {matched.map((r) => (
                <span
                  key={r.id}
                  className={`text-xs px-2.5 py-1 rounded-full border
                  ${
                    r.priority === "high"
                      ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                      : r.priority === "medium"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  {r.authority} • {r.priority}
                </span>
              ))}
            </div>
          )}

          {report ? (
            <div
              ref={reportRef}
              className="prose prose-invert max-w-none rtl text-right"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p className="mb-3 leading-relaxed" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-xl font-bold mt-6 mb-3 text-indigo-300"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-lg font-semibold mt-5 mb-2 text-sky-300"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-base font-semibold mt-4 mb-2 text-sky-200"
                      {...props}
                    />
                  ),
                }}
              >
                {mdReport}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">
              אין דוח עדיין. לחץ <b>צור דוח</b> כדי ליצור אחד.
            </p>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-screen-2xl pr-2 pl-4 sm:pr-4 sm:pl-6 lg:pr-8 lg:pl-8 pb-10 text-xs text-zinc-500">
        אבטיפוס • אינו ייעוץ משפטי. יש לאמת מול הרשויות.
      </footer>
    </div>
  );
}
