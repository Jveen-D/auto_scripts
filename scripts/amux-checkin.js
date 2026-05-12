const endpoint = "https://api.amux.ai/api/user/checkin";

const accessToken = process.env.AMUX_ACCESS_TOKEN;
const cookie = normalizeCookie(process.env.AMUX_COOKIE || process.env.AMUX_SESSION);
const userId = process.env.AMUX_USER_ID?.trim();

if (!userId) {
  console.error("Missing AMUX_USER_ID. Add it as a GitHub Actions secret.");
  process.exit(1);
}

if (!accessToken && !cookie) {
  console.error("Missing auth. Add AMUX_ACCESS_TOKEN or AMUX_COOKIE as a GitHub Actions secret.");
  process.exit(1);
}

const headers = {
  "New-Api-User": userId,
  Accept: "application/json, text/plain, */*"
};

if (accessToken) {
  headers.Authorization = `Bearer ${accessToken}`;
} else {
  headers.Cookie = cookie;
}

console.log(`Auth mode: ${accessToken ? "bearer token" : "session cookie"}`);
if (cookie) {
  console.log(`Cookie names: ${cookie.split(";").map((part) => part.trim().split("=")[0]).join(", ")}`);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers
});

const contentType = response.headers.get("content-type") || "";
const rawBody = await response.text();
let payload = rawBody;

if (contentType.includes("application/json") && rawBody) {
  try {
    payload = JSON.parse(rawBody);
  } catch {
    payload = rawBody;
  }
}

const message =
  typeof payload === "object" && payload !== null
    ? payload.message || payload.msg || payload.error || JSON.stringify(payload)
    : String(payload || "");

console.log(`AMUX check-in HTTP ${response.status}`);
if (message) {
  console.log(`Response: ${message}`);
}

if (!response.ok) {
  process.exit(1);
}

function normalizeCookie(value) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const sessionMatch = trimmed.match(/session=([^;\s]+)/i);
  if (sessionMatch) {
    return `session=${sessionMatch[1]}`;
  }

  return trimmed;
}
