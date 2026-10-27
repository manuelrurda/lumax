<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Bug report access allowlist
    |--------------------------------------------------------------------------
    |
    | Comma-separated email addresses allowed to open, view, and submit bug
    | reports. The raw environment value is intentionally stored unchanged
    | here; App\Support\EmailAllowlist is the single place that parses and
    | normalizes it (trim, lowercase, deduplicate, drop empty entries).
    |
    | Keep this empty to deny access to everyone, including administrators.
    | Set it before enabling the feature in a deployed environment.
    |
    */

    'allowed_emails' => env('BUG_REPORT_ALLOWED_EMAILS'),

];
