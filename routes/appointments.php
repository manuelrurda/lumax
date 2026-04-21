<?php

use App\Http\Controllers\AppointmentsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('appointments', AppointmentsController::class)->only([
        'index', 'store', 'update', 'destroy'
    ]);
});
