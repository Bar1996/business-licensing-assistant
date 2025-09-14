const API_BASE = "http://localhost:3000";

export async function matchRequirements(answers) {
  const res = await fetch(`${API_BASE}/requirements/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  return res.json();
}

export async function generateReport(answers) {
  const res = await fetch(`${API_BASE}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  return res.json();
}
