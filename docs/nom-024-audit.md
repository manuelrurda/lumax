# Audit: the NOM-024 claim on the clinical history page (issue #12)

**Date:** 2026-10-24 · **Scope:** `resources/js/pages/patients/history/index.tsx`, `PatientsController::history()`, `Patient` activity logging.

## The claim

The history page told the doctor:

> "Consulte las versiones anteriores del expediente de este paciente. **Las versiones cumplen con la NOM-024.**"

NOM-024-SSA3 regulates electronic health record systems in Mexico (information exchange / interoperability, security and audit expectations); NOM-004-SSA3 regulates the clinical record itself (minimum content, conservation). Nothing in the codebase substantiated the claim — no requirement mapping, no certification, no design document. This audit records what the implementation actually does, the gaps against what such a claim implies, and the conclusion.

## What the history implementation actually does (verified in code)

- **Version capture.** `Patient` uses spatie/laravel-activitylog (`LogsActivity`) with `logOnly` on the five clinical JSONB sections (`antecedentes`, `antecedentes_oftalmologicos`, `exploracion_fisica`, `estrabograma`, `refraccion`), `logOnlyDirty()` and `dontLogEmptyChanges()`: only actual changes to those sections create entries.
- **Full snapshots.** On every `updated` event, `tapActivity()` merges a snapshot of all five sections into the activity's properties, so any past version of the clinical record can be reconstructed exactly as it was.
- **Read-only replay.** The record layout accepts `?activity_id=`; `PatientsController::getPatientData()` swaps the patient's sections for the snapshot and the layout renders the form disabled. A historical version cannot be edited through that view.
- **Per-doctor scoping.** History and snapshot lookups are owner-scoped (`where('user_id', …)` on the patient; snapshots resolve through the owned patient), matching the rest of the app.
- **Author is recorded, not shown.** The activity table has `causer` morph columns and the logger records the authenticated user by default, so *who* made each change exists in the database. However, `PatientsController::history()` does not load the causer and the history page does not display any author — the visible audit trail is dates and changed section names only.
- **Default view is lossy.** Unless `?show_all=1` is passed, the timeline collapses to one entry per day (`unique` by date). Fine as a UI default, but the "versions" the doctor sees by default are not all versions.

## Gaps (from issue #12, verified)

1. **Author not displayed.** Causer is stored but never surfaced (see above). A version trail without a visible author is weak as an audit trail.
2. **No immutability / tamper evidence.** Activities live in a normal writable table; nothing prevents or detects edits to history rows (no hash chaining, no append-only store, no DB-level restrictions).
3. **No export or interoperability.** There is no export of a patient's record or history (no PDF, no structured exchange format). Interoperability is the core subject of NOM-024, and it is entirely absent.
4. **Read access is not logged.** Only writes to the five clinical sections are logged. Views of a record leave no trace; changes to patient identity fields (`first_name`, `last_name`, `email`, `phone`) are not logged either, since they are outside `logOnly`.
5. **Minimum record content (NOM-004) is not met by the data model.** A patient carries only first name, last name, email and phone — no date of birth, no CURP, no sex, no address. Whatever the UI claims, the expediente itself lacks identification elements a clinical record is expected to hold.
6. **Estrabograma and Ángulo Iridocorneal caveat.** At audit time the estrabograma canvas does not persist drawings (issue #5) and Ángulo Iridocorneal does not exist as data (issue #4), so "versions of the record" currently covers five sections, one of them only partially (legacy fields).

## Conclusion

**The claim was unsubstantiated as written and has been removed.** The history page now describes the feature factually (previous versions are kept and can be consulted) without invoking NOM-024.

Claiming conformance in the future requires, at minimum: a written mapping of the specific NOM-024/NOM-004 requirements the team intends to satisfy, the gaps above closed or explicitly accepted, and ideally an external review — a UI sentence is not a compliance program. Gaps the team decides to work on should be filed as their own issues rather than tracked here.
