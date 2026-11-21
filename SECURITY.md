# Security status

**Mauven v0.9.1 is a local-browser prototype, not a secure service.**

- No admin authentication, server-side authorization, database, or cloud synchronization.
- Notes and tasks persist in localStorage on the visitor's own device.
- Share previews are **not** public share links and work only against the originating browser data.
- Do not store passwords, patient information, financial records, or other sensitive content.
- Browser storage can be cleared; export backups frequently.
- HTML sanitizer and YouTube validation are prototype safeguards, not a professional security audit.
- The production design will require reviewed server-side authorization, content security policy,
  cloud persistence, secure file serving, backups and restore testing.

For security reports, avoid posting exploit details or personal data in public issues.
Contact the repository owner through their GitHub profile.
