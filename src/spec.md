# Specification

## Summary
**Goal:** Simplify the booking (request registration) form so users only need to provide Name, Phone Number, and Location to submit.

**Planned changes:**
- Remove the Brand selection UI, including any conditional “Specify Brand” input, from the booking form.
- Remove the “Request Type” (service/spares) selection from the booking form.
- Update booking form validation so only Name, Phone Number, and Location are required; all other existing fields (e.g., Category, Address, Description) remain optional and do not block submission.
- Ensure request creation still succeeds by sending sensible default values for removed fields when calling the existing createRequest flow, and confirm success/detail pages load without client errors.

**User-visible outcome:** Users can submit a booking using only Name, Phone Number, and Location, without being asked for Brand or Request Type, and the submission flow continues to work end-to-end.
