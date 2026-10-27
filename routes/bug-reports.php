<?php

use App\Http\Controllers\BugReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/bug-reports', [BugReportController::class, 'index'])->name('bug-reports.index');
    Route::post('/bug-reports', [BugReportController::class, 'store'])->name('bug-reports.store');
    Route::get('/bug-reports/{bugReport}', [BugReportController::class, 'show'])->name('bug-reports.show');
});
