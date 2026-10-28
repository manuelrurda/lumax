<?php

namespace Tests\Feature;

use App\Models\BugReport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BugReportTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'type' => 'bug',
            'description' => 'El botón de guardar no responde en la pestaña de refracción.',
            'page_path' => '/patients/1/refraccion',
            'page_url' => 'http://localhost/patients/1/refraccion',
            'page_component' => 'patients/records/refraccion',
            'viewport' => '1440x900',
        ], $overrides);
    }

    private function allowEmails(string|array|null $emails): void
    {
        config(['bug-reports.allowed_emails' => $emails]);
    }

    private function createAllowedUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $this->allowEmails($user->email);

        return $user;
    }

    /**
     * Fake the whole UploadThing v7 flow: prepareUpload, ingest PUT.
     */
    private function fakeUploadThing(): void
    {
        Http::fake(function ($request) {
            $url = $request->url();

            if (str_contains($url, 'api.uploadthing.com/v7/prepareUpload')) {
                $key = 'key-'.$request->data()['fileName'];

                return Http::response([
                    'url' => 'https://ingest.uploadthing.com/'.$key,
                    'key' => $key,
                ], 200);
            }

            if (str_contains($url, 'ingest.uploadthing.com')) {
                $key = basename(parse_url($url, PHP_URL_PATH));

                return Http::response([
                    'ufsUrl' => 'https://utfs.io/f/'.$key,
                    'url' => 'https://utfs.io/f/'.$key,
                ], 200);
            }

            return Http::response('unstubbed: '.$url, 404);
        });
    }

    public function test_guest_cannot_submit_a_bug_report(): void
    {
        $response = $this->post('/bug-reports', $this->payload());

        $response->assertRedirect('/login');
        $this->assertDatabaseCount('bug_reports', 0);
    }

    public function test_guest_cannot_view_bug_reports(): void
    {
        $this->get('/bug-reports')->assertRedirect('/login');
    }

    public function test_description_is_required(): void
    {
        $user = $this->createAllowedUser();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload(['description' => '']));

        $response->assertSessionHasErrors('description');
        $this->assertDatabaseCount('bug_reports', 0);
    }

    public function test_too_short_description_fails(): void
    {
        $user = $this->createAllowedUser();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload(['description' => 'ab']));

        $response->assertSessionHasErrors('description');
        $this->assertDatabaseCount('bug_reports', 0);
    }

    public function test_type_must_be_bug_or_mejora(): void
    {
        $user = $this->createAllowedUser();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload(['type' => 'otro']));

        $response->assertSessionHasErrors('type');
        $this->assertDatabaseCount('bug_reports', 0);
    }

    public function test_valid_report_is_stored_with_context_and_auto_title(): void
    {
        $user = $this->createAllowedUser();

        $response = $this->actingAs($user)
            ->withHeader('User-Agent', 'Mozilla/5.0 (TestBrowser)')
            ->post('/bug-reports', $this->payload([
                'description' => "Primera línea del reporte\ncon más detalle debajo.",
            ]));

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Reporte enviado. ¡Gracias!');

        $report = BugReport::firstOrFail();
        $this->assertSame($user->id, $report->user_id);
        $this->assertSame('bug', $report->type);
        $this->assertSame('Primera línea del reporte', $report->title);
        $this->assertSame('/patients/1/refraccion', $report->page_path);
        $this->assertSame('http://localhost/patients/1/refraccion', $report->page_url);
        $this->assertSame('patients/records/refraccion', $report->page_component);
        $this->assertSame('1440x900', $report->viewport);
        $this->assertSame('Mozilla/5.0 (TestBrowser)', $report->user_agent);
        $this->assertSame('nuevo', $report->status);
        $this->assertSame(0, $report->attachments()->count());
    }

    public function test_title_falls_back_when_first_line_is_empty_and_truncates(): void
    {
        $user = $this->createAllowedUser();

        $this->actingAs($user)->post('/bug-reports', $this->payload([
            'description' => str_repeat('a', 120),
        ]));

        $this->assertSame(80, strlen(BugReport::firstOrFail()->title));
    }

    public function test_report_with_files_stores_attachments_when_uploadthing_is_configured(): void
    {
        config(['services.uploadthing.token' => 'sk_live_test_token']);
        $this->fakeUploadThing();

        $user = $this->createAllowedUser();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload([
            'screenshot' => UploadedFile::fake()->image('captura.jpg', 800, 600),
            'attachments' => [UploadedFile::fake()->create('documento.pdf', 100, 'application/pdf')],
        ]));

        $response->assertRedirect();
        $response->assertSessionHas('message', 'Reporte enviado. ¡Gracias!');

        $report = BugReport::firstOrFail();
        $this->assertSame(2, $report->attachments()->count());

        $screenshot = $report->attachments()->where('kind', 'screenshot')->firstOrFail();
        $this->assertSame('captura.jpg', $screenshot->file_name);
        $this->assertStringStartsWith('https://utfs.io/f/', $screenshot->file_url);
        $this->assertNotNull($screenshot->file_size);

        $attachment = $report->attachments()->where('kind', 'attachment')->firstOrFail();
        $this->assertSame('documento.pdf', $attachment->file_name);
        $this->assertStringStartsWith('https://utfs.io/f/', $attachment->file_url);
    }

    public function test_report_with_files_is_stored_without_attachments_when_uploadthing_is_not_configured(): void
    {
        config(['services.uploadthing.token' => null]);
        Http::fake(); // must never be called

        $user = $this->createAllowedUser();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload([
            'screenshot' => UploadedFile::fake()->image('captura.jpg', 800, 600),
            'attachments' => [UploadedFile::fake()->create('documento.pdf', 100, 'application/pdf')],
        ]));

        $response->assertRedirect();
        $response->assertSessionHas('message');

        $report = BugReport::firstOrFail();
        $this->assertSame(0, $report->attachments()->count());
        Http::assertNothingSent();
    }

    public function test_more_than_four_attachments_are_rejected(): void
    {
        $user = $this->createAllowedUser();

        $files = collect(range(1, 5))
            ->map(fn ($i) => UploadedFile::fake()->image("foto{$i}.jpg"))
            ->all();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload(['attachments' => $files]));

        $response->assertSessionHasErrors('attachments');
    }

    public function test_index_lists_reports_for_authenticated_users(): void
    {
        $user = $this->createAllowedUser();
        $report = BugReport::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/bug-reports');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('bug-reports/index')
            ->has('reports.data', 1)
            ->where('reports.data.0.id', $report->id)
            ->where('reports.data.0.attachments_count', 0)
        );
    }

    public function test_show_displays_a_report_with_its_context(): void
    {
        $user = $this->createAllowedUser();
        $report = BugReport::factory()->create([
            'user_id' => $user->id,
            'description' => 'Descripción detallada del problema reportado.',
        ]);

        $response = $this->actingAs($user)->get('/bug-reports/'.$report->id);

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('bug-reports/show')
            ->where('report.id', $report->id)
            ->where('report.description', 'Descripción detallada del problema reportado.')
            ->has('report.attachments', 0)
            ->has('report.user')
        );
    }

    public function test_non_allowlisted_user_gets_403_on_index_show_and_store(): void
    {
        $this->allowEmails('allowed@example.com');
        $user = User::factory()->create(['email' => 'not-allowed@example.com']);
        $report = BugReport::factory()->create();

        $this->actingAs($user)->get('/bug-reports')->assertForbidden();
        $this->actingAs($user)->get('/bug-reports/'.$report->id)->assertForbidden();
        $this->actingAs($user)->post('/bug-reports', $this->payload())->assertForbidden();

        $this->assertDatabaseCount('bug_reports', 1);
    }

    public function test_empty_allowlist_denies_every_authenticated_user(): void
    {
        $this->allowEmails('');
        $user = User::factory()->create(['email' => 'would-be-allowed@example.com']);
        $report = BugReport::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)->get('/bug-reports')->assertForbidden();
        $this->actingAs($user)->get('/bug-reports/'.$report->id)->assertForbidden();
        $this->actingAs($user)->post('/bug-reports', $this->payload())->assertForbidden();

        $this->assertDatabaseCount('bug_reports', 1);
    }

    public function test_allowlist_matching_is_case_insensitive_end_to_end(): void
    {
        $user = User::factory()->create(['email' => 'doctor@example.com']);
        $this->allowEmails('  DOCTOR@EXAMPLE.COM  ');

        $this->actingAs($user)->get('/bug-reports')->assertOk();

        $response = $this->actingAs($user)->post('/bug-reports', $this->payload());
        $response->assertRedirect();
        $this->assertDatabaseCount('bug_reports', 1);
    }

    public function test_bug_report_access_is_shared_with_the_frontend(): void
    {
        $allowedUser = $this->createAllowedUser();

        $this->actingAs($allowedUser)
            ->get('/bug-reports')
            ->assertInertia(fn (Assert $page) => $page
                ->component('bug-reports/index')
                ->where('bugReports.canAccess', true)
            );

        $otherUser = User::factory()->create();

        $this->actingAs($otherUser)
            ->get('/patients')
            ->assertInertia(fn (Assert $page) => $page
                ->component('patients/index')
                ->where('bugReports.canAccess', false)
            );
    }
}
