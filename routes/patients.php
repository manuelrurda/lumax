<?php

use App\Http\Controllers\PatientsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/patients', [PatientsController::class, 'index'])->name('patients');
    // Must be registered before /patients/{patient} so "archived" is not
    // swallowed by the patient history route.
    Route::get('/patients/archived', [PatientsController::class, 'archived'])->name('patients.archived');
    Route::get('/api/patients/search', [PatientsController::class, 'searchApi'])->name('patients.search');
    Route::post('/patients', [PatientsController::class, 'store'])->name('patients.store');
    Route::put('/patients/{patient}', [PatientsController::class, 'update'])->name('patients.update');
    Route::delete('/patients/{patient}', [PatientsController::class, 'destroy'])->name('patients.destroy');
    Route::post('/patients/{patient}/restore', [PatientsController::class, 'restore'])->name('patients.restore');

    Route::get('/patients/{patient}', [PatientsController::class, 'history'])->name('patients.history');
    Route::get('/patients/{patient}/antecedentes', [PatientsController::class, 'antecedentes'])->name('patients.antecedentes');
    Route::get('/patients/{patient}/oftalmologicos', [PatientsController::class, 'oftalmologicos'])->name('patients.oftalmologicos');
    Route::get('/patients/{patient}/exploracion-fisica', [PatientsController::class, 'exploracionFisica'])->name('patients.exploracion-fisica');
    Route::get('/patients/{patient}/estrabograma', [PatientsController::class, 'estrabograma'])->name('patients.estrabograma');
    Route::get('/patients/{patient}/refraccion', [PatientsController::class, 'refraccion'])->name('patients.refraccion');
    Route::get('/patients/{patient}/angulo-iridocorneal', [PatientsController::class, 'anguloIridocorneal'])->name('patients.angulo-iridocorneal');
});

