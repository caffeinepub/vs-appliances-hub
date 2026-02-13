# Specification

## Summary
**Goal:** Replace the current VS Appliances logo across the frontend with the newly uploaded logo image.

**Planned changes:**
- Add a web-optimized PNG derived from `IMG_20260212_214859~2-1.png` under `frontend/public/assets/generated` and reference it via an `/assets/generated/...` URL.
- Update `frontend/src/components/SiteHeader.tsx` to render the new logo asset instead of `/assets/generated/vs-appliances-logo-uploaded.dim_512x512.png`, preserving aspect ratio and avoiding layout shifts.
- Update `frontend/src/pages/HomePage.tsx` to render the new logo asset instead of `/assets/generated/vs-appliances-logo-uploaded.dim_512x512.png`, preserving aspect ratio and avoiding layout shifts.
- Verify there are no remaining runtime references to `/assets/generated/vs-appliances-logo-uploaded.dim_512x512.png` (or any previous VS logo image) for primary branding, and confirm key pages show the new logo in the header.

**User-visible outcome:** Customers see the newly uploaded VS logo consistently in the site header (and on the homepage hero) across desktop and mobile, with correct sizing and no distortion.
