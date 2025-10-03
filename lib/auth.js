import cookie from "cookie";

export function parseAuth(req) {
  const cookies = cookie.parse(req ? req.headers.cookie || "" : document.cookie);
  return cookies.sessionToken || null;
}
