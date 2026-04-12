<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientsController extends Controller
{
    /**
     * Display the user's patients list.
     */
    public function index(Request $request): Response
    {
        $patients = Patient::select('id', 'first_name', 'last_name', 'email', 'phone', 'updated_at')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('patients/index', [
            'patients' => $patients,
        ]);
    }

    /**
     * Store a newly created patient in storage.
     */
    public function store(StorePatientRequest $request): RedirectResponse
    {
        Patient::create($request->validated());

        return redirect()->route('patients')->with('message', 'Paciente guardado exitosamente.');
    }
}
