<?php

use App\Http\Controllers\PatientsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/patients', [PatientsController::class, 'index'])->name('patients');
    Route::post('/patients', [PatientsController::class, 'store'])->name('patients.store');
    Route::put('/patients/{patient}', [PatientsController::class, 'update'])->name('patients.update');
    
    Route::get('/patients/{patient}', [PatientsController::class, 'antecedentes'])->name('patients.antecedentes');
    Route::get('/patients/{patient}/oftalmologicos', [PatientsController::class, 'oftalmologicos'])->name('patients.oftalmologicos');
    Route::get('/patients/{patient}/exploracion-fisica', [PatientsController::class, 'exploracionFisica'])->name('patients.exploracion-fisica');
});

