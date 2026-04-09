<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        App::setLocale('es');

        return Inertia::render('dashboard/index');
    }
}

