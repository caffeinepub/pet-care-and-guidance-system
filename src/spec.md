# Specification

## Summary
**Goal:** Provide a fully working Admin Dashboard at `/admin` with access control and end-to-end CRUD for categories, breeds, and video links.

**Planned changes:**
- Add an “Admin” navigation entry that is visible only to signed-in administrators and routes to `/admin` (with sub-routes `/admin/categories`, `/admin/breeds`, `/admin/videos`).
- Implement/ensure backend admin authorization via `isCallerAdmin`, including a secure bootstrap mechanism so at least one admin can be established on fresh deploys.
- Wire up complete CRUD flows on existing admin pages/hooks for Pet Categories, Breeds (including category selection), and Video Links (breed/category/health-topic), with list refresh after mutations.
- Ensure admin image uploaders store and render uploaded images (preview + persisted state) using the existing blob storage integration.
- Add clear success/error feedback across admin actions (e.g., toast messages) and apply a cohesive, distinct admin visual theme across all admin routes (avoiding blue/purple as the primary palette).

**User-visible outcome:** Admin users can access a dedicated `/admin` area from the main navigation, manage categories/breeds/videos (including images) with immediate feedback and updates, while non-admin users are prevented from accessing admin routes and see an “Access Denied” screen.
