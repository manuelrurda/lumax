<?php

namespace App\Policies;

use App\Models\BugReport;
use App\Models\User;
use App\Support\EmailAllowlist;

/**
 * Second enforcement layer for bug reports.
 *
 * Access is intentionally not scoped to reports created by the current user:
 * allowlisted collaborators can see the shared report queue. Being signed in
 * is not enough, however — the user's email must be on the configured
 * allowlist. An empty allowlist denies everyone.
 */
class BugReportPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->allowlist()->allows($user);
    }

    public function view(User $user, BugReport $bugReport): bool
    {
        return $this->allowlist()->allows($user);
    }

    public function create(User $user): bool
    {
        return $this->allowlist()->allows($user);
    }

    private function allowlist(): EmailAllowlist
    {
        return EmailAllowlist::fromConfig('bug-reports.allowed_emails');
    }
}
