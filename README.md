# Lumax

Electronic clinical record system (expediente clínico electrónico) for an ophthalmology practice, built for a single-doctor workflow: the doctor registers, manages their own patients, keeps each patient's clinical record in structured sections, tracks every version of that record, and manages appointments on a calendar.

The UI is in Spanish (es-MX). Code identifiers for clinical concepts are also mostly Spanish — keep them that way, they are domain language, not a translation backlog.

> **Status:** active development, not production-ready. See [Known issues & unfinished work](#known-issues--unfinished-work) before building on a section — two record tabs do not persist data yet.

## Stack

| Layer | Technology |
|---|---|
| Backend | PHP 8.2+, Laravel 12 |
| Frontend | React 19 + TypeScript, Inertia.js 2 (SPA-like, server-routed) |
| Build | Vite 7, Laravel Wayfinder (typed route helpers generated into `resources/js/routes/`) |
| Styling / UI | Tailwind CSS v4, shadcn/ui (Radix primitives), Lucide icons |
| Auth | Laravel Fortify + custom controllers in `app/Http/Controllers/Auth/`; email verification required |
| Clinical history | `spatie/laravel-activitylog` (snapshots, see below) |
| Calendar | `react-big-calendar` + `date-fns` |
| Diagram canvas | Konva / react-konva (`resources/js/components/canvas/`) |
| Forms (client) | `react-hook-form`; global draft state in zustand |
| Tests | Pest 4 (Feature + Unit) |

This repo started from the Laravel React starter kit, itself forked from an earlier documents project. Some files are leftovers from those templates — see [Template leftovers](#template-leftovers) so you don't mistake them for Lumax features.

## Quick start

Prerequisites: PHP 8.2+, Composer, Node 20+, and a database (SQLite works for local dev; the patients migration uses `jsonb` columns, which Laravel maps on SQLite/MySQL and natively on PostgreSQL).

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
# set DB_* in .env if not using the default sqlite database
php artisan migrate --seed
composer run dev   # serves Laravel + queue listener + logs + Vite together
```

`npm run dev` alone only starts Vite. The seeded users (local dev only, password is `password` for all) are `test@example.com` (20 patients), `house@example.com` (5) and `strange@example.com` (15) — see `database/seeders/DatabaseSeeder.php`. Public registration is also open at `/register` and requires an RFC (validated as 13 characters only).

Useful commands:

```bash
composer run test        # or: php artisan test  (Pest suite)
npm run types            # tsc --noEmit
npm run lint             # eslint --fix
npm run format:check     # prettier check over resources/
npm run build           # production assets
```

## How the app is organized

### Request flow (one record tab, end to end)

Every clinical section follows the same chain — learn this once and you can navigate the whole app:

1. **Route** — `routes/patients.php`: `GET /patients/{patient}/<section>` → a method on `PatientsController`, inside an `auth` + `verified` group.
2. **Controller** — `PatientsController::getPatientData()` loads the patient *scoped to the logged-in doctor* (`where('user_id', Auth id)`), selects only the columns that tab needs, and — if `?activity_id=` is present — replaces the clinical fields with the historical snapshot stored on that activity (read-only history view).
3. **Page** — Inertia renders `resources/js/pages/patients/records/<section>.tsx`, a thin wrapper that mounts `PatientRecordLayout` (header, tab bar, read-only banner in history view) plus the section's form component from `records/forms/<section>-form.tsx`.
4. **Form + schema** — each form is typed by a schema file in `records/schemas/<section>.ts` (a TypeScript interface + a `default<Section>` object with every field). Forms use `react-hook-form`.
5. **Save** — the form submits `PUT /patients/{patient}` with `{ ...patient, <section>: data }`. There is *no* per-section endpoint: `PatientsController::update()` + `UpdatePatientRequest` handle all sections.
6. **History** — the update is logged by the activity log (below), which is what makes the version timeline possible.

### Backend map (`app/`)

| Path | What lives there |
|---|---|
| `app/Models/User.php` | The doctor. `first_name`, `last_name`, `rfc`, `email`, `password`; `patients()` and `appointments()` has-many relations; `fullName` accessor; must verify email. |
| `app/Models/Patient.php` | A patient *and* their entire clinical record (see data model). Uses `LogsActivity`. |
| `app/Models/Appointment.php` | `user_id`, `patient_id`, `title`, `notes`, `starts_at`, `ends_at` (datetime casts). |
| `app/Http/Controllers/PatientsController.php` | Patient list/search, the JSON autocomplete (`searchApi`), every record-tab page, the history timeline (`history`), store/update. |
| `app/Http/Controllers/AppointmentsController.php` | Calendar JSON feed + page (`index` branches on `wantsJson()`), store/update/destroy with an overlap check against all of the doctor's appointments. |
| `app/Http/Controllers/Auth/*`, `Settings/*` | Fortify-backed auth flows and profile/password settings (mostly starter-kit code). |
| `app/Http/Requests/` | `StorePatientRequest`, `UpdatePatientRequest` (the gate for what of a patient may be saved — a new clinical field must be added here, to the model `$fillable`/`casts`, and to a migration), plus starter-kit auth/settings requests. |
| `app/Http/Middleware/HandleInertiaRequests.php` | Shared Inertia props: app name, `auth.user`, flash messages, sidebar state. In history view the controller additionally shares `isHistoryView`, `activityId`, `historyDate`. |
| `app/Rules/ValidRfc.php`, `ValidCurp.php` | Template-leftover validation rules with unit tests. Currently **not used** by registration (RFC is only checked for length). |
| `app/Services/`, `app/Enums/` | Empty. Put orchestration logic / PHP enums here if a feature outgrows a controller. |
| `app/Mail/`, `app/Notifications/` | `VerifyEmail` notification is used; `DocumentReceivedNotification` mail is a template leftover. |

### Frontend map (`resources/js/`)

| Path | What lives there |
|---|---|
| `pages/patients/index.tsx` + `pages/patients/ui/` | Patient list: search/sort/pagination, create & edit patient dialogs, today's-appointments panel. |
| `pages/patients/records/` | One page per clinical tab, `patient-record-layout.tsx` (the shared tab shell), `forms/` (one form component per section), `schemas/` (one TS type + defaults per section). |
| `pages/patients/history/index.tsx` | Version timeline for a patient (see Clinical history). |
| `pages/appointments/` | Calendar page + `ui/appointments-calendar.tsx` and `ui/appointment-dialog.tsx` (patient picker uses the search API). |
| `pages/CanvasTest.tsx` | Standalone test page for the canvas component, served at `/canvas-test`. |
| `components/canvas/` | `image-canvas.tsx` (Konva annotation editor: freehand lines, arrows, text, undo/redo, pan/zoom) plus its `toolbar.tsx` and `zoom-controls.tsx`. |
| `components/ui/` | shadcn/ui primitives — don't hand-roll duplicates. |
| `hooks/use-draft-store.ts` | Zustand store that keeps unsaved form data per patient+section (`patient-<id>-<section>`) when switching tabs. Persisted to `sessionStorage` (key `lumax-drafts`) since issue #7: drafts survive a page reload, die with the tab session, and are wiped on logout. |
| `routes/`, `wayfinder/` | **Generated by Wayfinder. Do not edit by hand** — change the PHP routes and rebuild. |
| `types/index.d.ts` | Shared TS types (`User`, `Patient`, `SharedData`, nav items...). Keep in sync with `HandleInertiaRequests`. |
| `layouts/`, `components/app-sidebar.tsx` | App shell. Sidebar has exactly two entries: Pacientes and Citas. |

### Routes (`routes/`)

`web.php` only composes: it redirects `/` → patients list, requires the files below, and registers `/canvas-test`.

| File | Contents |
|---|---|
| `patients.php` | Patient list, `GET /api/patients/search` (autocomplete JSON), `POST /patients`, `PUT /patients/{patient}`, and one GET per record tab + `GET /patients/{patient}` (history). All behind `auth` + `verified`. |
| `appointments.php` | `Route::resource('appointments')` limited to index/store/update/destroy. |
| `auth.php`, `settings.php` | Starter-kit Fortify/settings routes. |
| `console.php` | Default artisan console route. |

There is **no** patient delete route and no per-section API — by design so far, not an oversight to 'fix' silently.

## Data model

Only three domain tables exist: `users`, `patients`, `appointments` (plus Laravel's cache/jobs/sessions and `activity_log`).

A patient's clinical record is **not** normalized into visits or per-section tables. The `patients` row holds identity/contact columns (`first_name`, `last_name`, `email`, `phone`) and one nullable **JSONB column per clinical section**, cast to `array` on the model:

| Column | Tab | Contents (defined by its TS schema) |
|---|---|---|
| `antecedentes` | Antecedentes | Heredofamiliares, patológicos and no-patológicos background (sub-forms in `antecedentes-form.tsx` and siblings). |
| `antecedentes_oftalmologicos` | Antecedentes Oftalmológicos | Ophthalmological background. |
| `exploracion_fisica` | Exploración Física | Physical examination. |
| `refraccion` | Refracción | Per-eye visual acuity (decimal / fraction / Snellen 6m / Snellen 20ft / logMAR scales in `schemas/refraccion.ts`), keratometry, retinoscopy, refraction, cycloplegia, addition, distance, comments. |
| `estrabograma` | Estrabograma | Strabismus diagram annotations: canvas `shapes` (issue #5) plus the legacy form's fields (`campo_1`…`campo_26`, `observaciones`), which remain readable for older records. |

Practical consequences of the JSONB approach: adding a field to a section is a TS-schema + form change only (no migration), but the backend accepts any array shape — `UpdatePatientRequest` validates sections as just `nullable|array`, so the TS schema is the real contract. Keep schemas accurate.

### Clinical history (versions)

`Patient` uses spatie's `LogsActivity`, logging **only** the five clinical columns, dirty-only, skipping empty changes. `tapActivity()` merges a **full snapshot** of all five sections into every `updated` activity, which powers:

- `GET /patients/{patient}` — timeline page. Default view collapses to one entry per day; `?show_all=1` lists every change.
- Opening a version re-renders any record tab with `?activity_id=<id>`; the layout shows the historical date and wraps the form in a disabled `fieldset` (read-only).

An earlier version of the history page claimed the versions comply with NOM-024. That claim was audited in issue #12, found unsubstantiated, and removed — the page now describes the version history factually. See [docs/nom-024-audit.md](docs/nom-024-audit.md) for what the implementation does, the gaps, and what claiming conformance would require.

## Bug & feature reports (in-app)

The sidebar footer has a persistent **«Reportar problema»** button (mounted once in `components/app-sidebar.tsx`, so it shows on every authenticated page). It opens a dialog (`components/bug-report/bug-report-dialog.tsx`) where the doctor picks a type — **Error** (`bug`) or **Mejora o función nueva** (`mejora`) — and writes a description; the title is auto-generated server-side from the first line of the description. On submit the app automatically attaches context an agent needs to act on the report:

- the page it was sent from: `page_path`, `page_url`, the Inertia `page_component`, and the `viewport` size;
- the browser `user_agent` (read server-side from the request header);
- a **screenshot of the page** captured in the browser with `html-to-image` *before* the dialog opens (so the dialog is never in the shot), plus up to 4 user-attached files (images or PDF, 8 MB each).

Reports are listed at `GET /bug-reports` with a detail page at `GET /bug-reports/{id}` (also in the sidebar as «Reportes»). During this single-doctor testing phase any authenticated user can view all reports.

**Storage:** two tables — `bug_reports` (`user_id`, `type`, `title`, `description`, `page_path`, `page_url`, `page_component`, `user_agent`, `viewport`, `status` starting at `nuevo`, timestamps) and `bug_report_attachments` (`bug_report_id`, `kind` = `screenshot` | `attachment`, `file_url`, `file_name`, `file_type`, `file_size`). To read pending work, query `bug_reports` where `status = 'nuevo'` ordered by `created_at`, joining `bug_report_attachments` for the screenshot/file URLs.

**Files need UploadThing.** Attachment binaries are stored on UploadThing via `app/Services/UploadThingService.php` (v6 API: `uploadFiles` presign → PUT to the presigned URL → poll `pollUpload/{key}`). Set `UPLOADTHING_TOKEN` in `.env` to enable them. **Without the token the feature still works**: reports are saved with all their context, just without screenshot/attachments, and the dialog warns the user about it (the `bugReports.uploadsEnabled` shared Inertia prop drives that state).

## Record tabs: what actually persists

| Tab | State |
|---|---|
| Antecedentes | ✅ Working form, persisted. |
| Antecedentes Oftalmológicos | ✅ Working form, persisted. |
| Exploración Física | ✅ Working form, persisted. |
| Refracción | ✅ Working form, persisted. Most complete schema. |
| Estrabograma | ✅ Canvas drawings persist (issue #5). `ImageCanvas` is controlled (`initialShapes` + `onChange`, `readOnly` in history view); shapes are stored in the `estrabograma` JSON under `shapes`, alongside `observaciones` and any legacy `campo_*` data. |
| Ángulo Iridocorneal | ❌ **Stub.** Page, route, tab and schema exist, but the form renders no fields and its submit handler only `console.log`s (`angulo-iridocorneal-form.tsx`). There is no DB column, model field, or validation rule for it. |

## Adding a new clinical section (checklist)

Follow the existing pattern exactly:

1. Migration: add a nullable `jsonb` column to `patients`.
2. `Patient` model: add the column to `$fillable`, to `casts()` as `array`, to `getActivitylogOptions()->logOnly(...)`, and to the snapshot array in `tapActivity()` — miss the last two and history breaks silently for that section.
3. `UpdatePatientRequest`: add `'<section>' => ['nullable', 'array']`.
4. Route in `routes/patients.php` + a `PatientsController` method that calls `getPatientData()` selecting the new column.
5. Frontend: page in `pages/patients/records/`, form in `records/forms/`, schema (interface + defaults) in `records/schemas/`, and a tab entry in `patient-record-layout.tsx`.
6. History labels: add the field → label mapping in `pages/patients/history/index.tsx` (`getModifiedFields`).
7. Add a Pest feature test modeled on `tests/Feature/PatientRefraccionFormTest.php`.

## Tests

Pest suite in `tests/` (sqlite in-memory, configured in `phpunit.xml`). Domain coverage: `PatientCreationTest`, `PatientUpdateTest`, `PatientAntecedentesFormTest`, `PatientOftalmologicosFormTest`, `PatientRefraccionFormTest`, `AppointmentsTest` (including overlap rejection), `PatientActivityLogTest` (logging + snapshot behavior). Auth/settings tests and `tests/Unit/Rules/` (RFC/CURP) come from the starter template. `tests/Feature/Documents/` is an empty leftover directory.

## Known issues & unfinished work

- **Passwords are logged on registration:** `RegisteredUserController::store()` calls `Log::info('Register request payload', $request->all())`, which writes the plaintext password to the log. Remove before anything else ships.
- **Appointment patient ownership:** `AppointmentsController` validates `patient_id` as `exists:patients,id` only. A doctor can attach *another doctor's* patient to their own appointment. Scope it to the authenticated user's patients (patients themselves are correctly owner-scoped everywhere else).
- **Ángulo Iridocorneal is a stub** — see the tab table above.
- **`/canvas-test` is public** (registered in `web.php` without auth middleware) and renders an external stock photo. Remove or protect before deploying.
- **Registration is fully open** — anyone can create a doctor account. Fine for local dev; gate it before production.
- **No patient deletion** and appointments hard-delete (`destroy` actually deletes the row).

## Template leftovers

Mostly cleaned up in issue #11. What was removed: the `setasign/fpdi` + `fpdi-tcpdf` Composer deps, `resources/js/components/pdf-viewer/` (plus its exclusive npm packages `react-pdf`, `react-rnd`, `re-resizable`, and the unused `qrcode.react`), `app/Mail/DocumentReceivedNotification.php`, and the dead `unam-gold` CSS class (never defined as a theme token; the brand token is `lumax-purple`, now used in its place in the nav and transition loader). The `devai/` template guide and the empty `tests/Feature/Documents/` directory were already gone before that cleanup.

What deliberately stays:

- `app/Rules/ValidCurp.php` (+ its unit test) — unused today, kept as planned: CURP is a plausible future patient field. (`ValidRfc.php` is no longer a leftover at all — registration uses it.)

## Notes for agents

- Do not read, print, or commit `.env`. Configuration lives in `config/` and `.env.example`.
- Never hand-edit `resources/js/routes/**` or `resources/js/wayfinder/**` — they are generated from the PHP routes.
- `vendor/` and `node_modules/` are installed dependencies, not source.
- When you change what a clinical section stores, update its TS schema, this README's data-model table, and the history label map in the same change.
