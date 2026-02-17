# Specification

## Summary
**Goal:** Restore correct admin detection and make an admin-only panel available for managing pet content.

**Planned changes:**
- Fix the frontend admin role check to call the existing backend `isAdmin()` method consistently, and use it to gate the Admin navbar link and all `/admin` routes.
- Add an access denied screen/handling for non-admin users attempting to visit `/admin`.
- Implement/ensure Admin panel pages for managing Pet Categories, Breeds, and YouTube Video Links with working create/update/delete flows, accessible only to admins.

**User-visible outcome:** Admin users see an “Admin” link in the navbar and can access `/admin` to add/edit/delete pet categories, breeds, and related YouTube video links; non-admin users do not see the link and are blocked from `/admin`.
