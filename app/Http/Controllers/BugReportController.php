<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBugReportRequest;
use App\Models\BugReport;
use App\Models\BugReportAttachment;
use App\Services\UploadThingException;
use App\Services\UploadThingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BugReportController extends Controller
{
    /**
     * List all bug reports, newest first.
     *
     * Access is controlled by the configured email allowlist (see
     * config/bug-reports.php). The route middleware is the first enforcement
     * layer; this policy check is a second, defense-in-depth layer. Reports
     * are shared among allowlisted users rather than scoped to their author.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', BugReport::class);

        $reports = BugReport::query()
            ->with('user')
            ->withCount('attachments')
            ->latest()
            ->paginate(20);

        return Inertia::render('bug-reports/index', [
            'reports' => $reports,
        ]);
    }

    /**
     * Show a single bug report with its context and attachments.
     */
    public function show(BugReport $bugReport): Response
    {
        Gate::authorize('view', $bugReport);

        $bugReport->load(['user', 'attachments']);

        return Inertia::render('bug-reports/show', [
            'report' => $bugReport,
        ]);
    }

    /**
     * Store a new bug report sent from the in-app dialog.
     *
     * Attachments (page screenshot + user files) are stored on UploadThing.
     * If UploadThing is not configured (no UPLOADTHING_TOKEN), the report is
     * still saved, just without files, and the UI warns about it.
     */
    public function store(StoreBugReportRequest $request, UploadThingService $uploads): RedirectResponse
    {
        Gate::authorize('create', BugReport::class);

        $validated = $request->validated();

        $title = Str::of(Str::before($validated['description'], "\n"))
            ->trim()
            ->limit(80, '')
            ->toString();

        $report = BugReport::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'title' => $title !== '' ? $title : 'Sin título',
            'description' => $validated['description'],
            'page_path' => $validated['page_path'],
            'page_url' => $validated['page_url'] ?? null,
            'page_component' => $validated['page_component'] ?? null,
            'user_agent' => Str::limit((string) $request->userAgent(), 255, ''),
            'viewport' => $validated['viewport'] ?? null,
            'status' => BugReport::STATUS_NUEVO,
        ]);

        $hasFiles = $request->hasFile('screenshot') || $request->hasFile('attachments');

        if ($hasFiles && ! $uploads->configured()) {
            return back()->with('message', 'Reporte enviado. ¡Gracias! Nota: los archivos adjuntos no se guardaron porque el almacenamiento aún no está configurado en este servidor.');
        }

        if ($hasFiles) {
            try {
                if ($request->hasFile('screenshot')) {
                    $file = $request->file('screenshot');
                    $result = $uploads->upload($file);

                    $report->attachments()->create([
                        'kind' => BugReportAttachment::KIND_SCREENSHOT,
                        'file_url' => $result['url'],
                        'file_name' => $result['name'],
                        'file_type' => $result['type'],
                        'file_size' => $result['size'],
                    ]);
                }

                foreach ($request->file('attachments', []) as $file) {
                    $result = $uploads->upload($file);

                    $report->attachments()->create([
                        'kind' => BugReportAttachment::KIND_ATTACHMENT,
                        'file_url' => $result['url'],
                        'file_name' => $result['name'],
                        'file_type' => $result['type'],
                        'file_size' => $result['size'],
                    ]);
                }
            } catch (UploadThingException) {
                return back()->with('error', 'El reporte se guardó, pero algunos archivos no pudieron subirse. Intenta adjuntarlos de nuevo en un reporte nuevo.');
            }
        }

        return back()->with('message', 'Reporte enviado. ¡Gracias!');
    }
}
