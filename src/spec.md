# Specification

## Summary
**Goal:** Fix Google Search Console HTML file verification by making the required verification file accessible at the site root (including the trailing-slash variant).

**Planned changes:**
- Add/serve a static file at `/googlea74065339385fd9b.html` that returns HTTP 200 with body `google-site-verification: googlea74065339385fd9b.html`.
- Ensure requests to `/googlea74065339385fd9b.html/` also return HTTP 200 with the same verification body, without breaking the non-trailing-slash URL.
- Verify the verification file is served as a static asset from the deployed frontend (not handled by a React route).

**User-visible outcome:** Google Search Console can successfully fetch the verification file from `https://vsapplianceshub.in/googlea74065339385fd9b.html` (and `.../googlea74065339385fd9b.html/`) and complete ownership verification.
