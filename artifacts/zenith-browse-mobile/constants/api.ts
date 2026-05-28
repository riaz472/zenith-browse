const domain = process.env["EXPO_PUBLIC_DOMAIN"];
const replId = process.env["EXPO_PUBLIC_REPL_ID"];

export function getApiBaseUrl(): string {
  if (domain) {
    return `https://${domain}/api`;
  }
  if (replId) {
    return `https://${replId}.replit.app/api`;
  }
  return "/api";
}
