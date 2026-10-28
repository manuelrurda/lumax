<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Registration allowlist
    |--------------------------------------------------------------------------
    |
    | Comma-separated email addresses allowed to create an account. The raw
    | environment value is intentionally stored unchanged here;
    | App\Support\EmailAllowlist is the single place that parses and
    | normalizes it (trim, lowercase, deduplicate, drop empty entries).
    |
    | Keep this empty to close registration for everyone (the secure
    | default). Set it before exposing a deployed instance publicly.
    |
    */

    'allowed_emails' => env('REGISTRATION_ALLOWED_EMAILS'),

];
