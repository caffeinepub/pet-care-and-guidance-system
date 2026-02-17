# Specification

## Summary
**Goal:** Restore a complete, navigable Pet Care and Guidance System with reliable pets/breeds catalogs, expanded pet coverage, improved rule-based AI assistant, stronger Health & Care content, smart vaccination reminders, and enforced Admin/User RBAC.

**Planned changes:**
- Fix Pets/Breeds catalog rendering so Cats/Dogs/Birds/Other Pets and their routes always work; fall back to static catalogs when backend data is empty and correctly map backend data when present.
- Implement the full hierarchical Pets module, including “Other Pets” subcategory groups and detail pages with descriptions, care info, images/placeholders, and titled YouTube links.
- Expand Cat, Dog, and Parrot sections with multiple breed list/detail pages including required sections and embedded YouTube videos.
- Expand Health & Care into grooming, nutrition, vaccination guidance, and emergency care, with topic pages (symptoms/causes/prevention/immediate steps), urgent labeling, safety notices, and titled YouTube guides.
- Make a single centralized AI Assistant page linked from Home, Dashboard, and navbar with three options: Behavioral/Health Prediction, Emergency Care Assistance (interactive follow-ups and urgency), and Breed Identification via image upload, including clear disclaimers.
- Update backend PetType support to include cat/dog/bird/other while keeping existing data readable and endpoints functioning.
- Implement RBAC: protect admin routes and backend mutations, route admins to Admin Dashboard after login, hide admin controls from regular users, and provision exactly three initial admin accounts.
- Add admin tooling to manage Health & Care content and to add/remove/disable user accounts; enforce disabled accounts across authenticated features.
- Improve dashboard vaccination reminders to show due-today/tomorrow/this-week/this-month/overdue messaging and exclude completed vaccinations.
- Apply a consistent modern, professional, friendly visual theme across user and admin areas with prominent safety/disclaimer presentation.

**User-visible outcome:** Users can browse a complete pets/breeds/health catalog (even if backend content is empty), manage broader pet profiles, receive clearer vaccination reminders, and use a centralized interactive AI assistant; admins can securely manage site content and users with protected access and correct post-login routing.
