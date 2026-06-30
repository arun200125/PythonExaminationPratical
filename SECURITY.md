# Production Security Notes

No public website can be guaranteed "unhackable." This project is now hardened for static hosting, but the current architecture is still client-side only.

## What is hardened here

- Inline JavaScript and CSS were moved to same-origin asset files so a strict Content Security Policy can block injected inline scripts.
- Static host security headers were added in `_headers`, `vercel.json`, and `.htaccess`.
- Admin password records now use PBKDF2-HMAC-SHA-256 with 600,000 iterations when served from HTTPS or localhost.
- Access-code generation and question randomization now use `crypto.getRandomValues()` instead of `Math.random()`.
- The page includes a no-referrer policy and a restrictive meta CSP for hosts that do not apply custom headers.

## Required before publishing

- Publish only on HTTPS.
- Keep HSTS preload only if the main domain and every subdomain will always support HTTPS.
- Use a host that applies one of the included header configs. After deploy, verify headers with browser DevTools or a security scanner.
- Do not treat browser `localStorage` as a secure database. Students or admins can inspect and alter data stored in their own browser.

## Required for exam-grade security

Move these features to a server before using this as a real public examination system:

- Admin login and password verification
- Access-code validation
- Question bank storage
- Student registrations and generated paper records
- One-time download enforcement
- Audit logs and backups
- Rate limiting and account lockout

Use the OWASP guidance as the baseline:

- OWASP HTTP Headers Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
- OWASP Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
