<?php

namespace App\Http\Middleware;

use App\Support\EmailAllowlist;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * First enforcement layer for bug reports: only users whose email address is
 * on the configured allowlist may reach any bug-report route.
 */
class EnsureBugReportAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $allowlist = EmailAllowlist::fromConfig('bug-reports.allowed_emails');

        if (! $allowlist->allows($request->user())) {
            abort(403);
        }

        return $next($request);
    }
}
