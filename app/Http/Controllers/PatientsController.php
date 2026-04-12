<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
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
        $query = Patient::select('id', 'first_name', 'last_name', 'email', 'phone', 'updated_at')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        $patients = $query->paginate(10)->withQueryString();

        return Inertia::render('patients/index', [
            'patients' => $patients,
            'filters' => $request->only('search'),
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

    /**
     * Update the specified patient in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        $patient->update($request->validated());

        return redirect()->route('patients')->with('message', 'Paciente actualizado exitosamente.');
    }
}
