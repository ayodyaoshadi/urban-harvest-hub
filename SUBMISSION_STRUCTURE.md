# Submission Structure: Task 1 vs Task 2 & 3

This document confirms **what to submit** for each task so it matches the assignment requirements.

---

## Task 1: The SPA code (excluding framework files)

**Requirement:** The SPA code (excluding framework files).

**What you have (correct):**

| What to submit | Location | Notes |
|----------------|----------|--------|
| **SPA application code** | `Task 1/client/` | React Single Page Application |
| **Your code (exclude framework)** | `Task 1/client/src/` | Components, pages, contexts, services, i18n, data |
| **Supporting app files** | `Task 1/client/public/`, `Task 1/client/index.html`, `Task 1/client/tailwind.config.js`, `Task 1/client/vite.config.js`, `Task 1/client/package.json` | Config and static assets for the SPA |
| **Exclude** | `Task 1/client/node_modules/` | Framework and dependencies (do not submit; use `npm install` to restore) |

So for **Task 1** you submit the **Task 1/client** folder (or a zip/archive of it) **without** `node_modules`. The SPA code is in `Task 1/client`; “excluding framework files” means do not include `node_modules` (and optionally exclude lockfiles if the assignment says so).

---

## Task 2 & 3: PWA + presentation + REST API + frontend

**Requirement:** The PWA code and presentation + The REST API code (Node.js + database integration) and the frontend code.

**What you have (correct):**

| What to submit | Location | Notes |
|----------------|----------|--------|
| **PWA code and presentation** | `Task 1/client/` | Same React app: PWA = `public/sw.js`, `public/manifest.json`; presentation = full UI (components, pages, styling) |
| **Frontend code** | `Task 1/client/` | Same as above – the React app that consumes the REST API |
| **REST API code (Node.js)** | `Task 2/server/` | Express app in `Task 2/server/src/` (index.js, routes, middleware, db, utils) |
| **Database integration** | `Task 2/server/src/db/` | SQLite schema, seed, database.js; `data/urban_harvest.db` (or instructions to create it) |

So for **Task 2 & 3** you submit:

1. **PWA + presentation + frontend:** `Task 1/client/` (again, without `node_modules`).
2. **REST API + database:** `Task 2/server/` (include `package.json`, `src/`, and either the DB file or clear instructions to run migrations/seed).

The frontend and PWA live in **Task 1/client** and are reused for Task 2 & 3; the **Task 2/server** is the Node.js REST API and database integration.

---

## Summary

| Task | Deliverable | Folder(s) |
|------|-------------|-----------|
| **Task 1** | SPA code (excluding framework files) | `Task 1/client/` (exclude `node_modules`) |
| **Task 2 & 3** | PWA code and presentation | `Task 1/client/` (exclude `node_modules`) |
| **Task 2 & 3** | REST API (Node.js + database) | `Task 2/server/` |
| **Task 2 & 3** | Frontend code | `Task 1/client/` (same as PWA) |

So yes – you have the right structure: Task 1 = SPA in Task 1/client; Task 2 & 3 = PWA + presentation + frontend in Task 1/client, and REST API + DB in Task 2/server.
