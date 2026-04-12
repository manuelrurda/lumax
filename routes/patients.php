<?php

use App\Http\Controllers\PatientsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/patients', [PatientsController::class, 'index'])->name('patients');
    Route::post('/patients', [PatientsController::class, 'store'])->name('patients.store');
});

