<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CanvasTestRouteTest extends TestCase
{
    use RefreshDatabase;

    public function test_canvas_test_route_is_not_registered(): void
    {
        $this->assertFalse(
            app('router')->getRoutes()->hasNamedRoute('canvas.test')
        );
    }

    public function test_canvas_test_url_returns_404_for_guests(): void
    {
        $this->get('/canvas-test')->assertNotFound();
    }

    public function test_canvas_test_url_returns_404_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/canvas-test')->assertNotFound();
    }
}
