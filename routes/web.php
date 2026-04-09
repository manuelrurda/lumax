<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/dashboard.php';


