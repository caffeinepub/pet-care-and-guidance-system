# Specification

## Summary
**Goal:** Fix admin panel button visibility issue in production deployment.

**Planned changes:**
- Debug and fix admin button not appearing in Navbar component on deployed web version
- Verify useCallerRole hook correctly identifies admin users in production environment
- Ensure backend isCallerAdmin method properly validates admin principals in production

**User-visible outcome:** Admin users will see the admin panel button in the header navigation when logged in, allowing them to access the admin panel on the deployed website.
