# Specification

## Summary
**Goal:** Make the Admin Dashboard more efficient for request triage and management by adding client-side search/filter/sort tools, summary widgets, quicker editing actions, CSV export, and reliable data refresh after updates.

**Planned changes:**
- Add client-side search over the existing admin request list (at least Request ID, customer name, and phone number; case-insensitive for text fields).
- Add client-side filters for Status (Open/Closed/All), Category (AC/Washing Machine/Refrigerator/Electrical/All), and Type (Service/Spares/All), plus a clear/reset control.
- Add sorting controls (or sortable headers) for Created time (newest/oldest) and Status.
- Add summary widgets computed from the already-fetched request list (Total, Open, Closed, Unassigned).
- Improve the request editing/details view to show additional customer-provided fields (including address) and timestamps (createdTime, updatedTime), and add a quick action to set status Open/Closed while keeping full edit capability.
- Add a client-side “Export CSV” action that exports the currently visible (post-filter/search/sort) request list with the required columns.
- Fix React Query cache invalidation after admin updates so the admin list and relevant customer-facing caches refresh correctly without manual browser refresh.

**User-visible outcome:** Admins can quickly search, filter, sort, summarize, update, and export requests from the Admin Dashboard, and see updates reflected immediately across relevant pages after saving changes.
