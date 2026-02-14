# Specification

## Summary
**Goal:** Add a reusable frontend image component with consistent loading attributes and graceful, accessible fallback behavior, then standardize key image usages to use it.

**Planned changes:**
- Create a reusable React/TypeScript image wrapper component (e.g., `frontend/src/components/AppImage.tsx`) supporting `src`, `alt`, `className`, optional `loading`/`decoding`, and an `onError` fallback UI (no backend calls; static asset paths only).
- Refactor `frontend/src/components/BrandLogo.tsx` to use the new image component while preserving existing `sm`/`md`/`lg` sizing behavior and current fallback behavior.
- Refactor `frontend/src/components/CategoryGrid.tsx` to use the new image component while preserving existing hover/scale styling and lazy-loading behavior; ensure layout remains stable on image load failure.

**User-visible outcome:** Images (brand logo and category cards) render consistently across the app, and if an image fails to load users see a styled fallback instead of a broken image icon.
