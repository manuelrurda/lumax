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
        $query = $request->user()->patients()->select('id', 'first_name', 'last_name', 'email', 'phone', 'updated_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'LIKE', "%{$search}%")
                  ->orWhere('last_name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        if ($request->filled('sort')) {
            $sort = $request->sort;
            if ($sort === 'name_asc') {
                $query->orderBy('first_name', 'asc')->orderBy('last_name', 'asc');
            } elseif ($sort === 'name_desc') {
                $query->orderBy('first_name', 'desc')->orderBy('last_name', 'desc');
            } else {
                $query->latest();
            }
        } else {
            $query->latest();
        }

        $patients = $query->paginate(10)->withQueryString();

        return Inertia::render('patients/index', [
            'patients' => $patients,
            'filters' => (object) $request->only(['search', 'sort']),
        ]);
    }

    /**
     * Display the specified patient.
     */
    public function antecedentes(Request $request, $id): Response
    {
        $patient = Patient::where('user_id', $request->user()->id)
            ->select('id', 'first_name', 'last_name', 'email', 'phone', 'antecedentes', 'updated_at')
            ->findOrFail($id);

        return Inertia::render('patients/records/antecedentes', [
            'patient' => $patient,
        ]);
    }

    /**
     * Display the specified patient oftalmologicos tab.
     */
    public function oftalmologicos(Request $request, $id): Response
    {
        $patient = Patient::where('user_id', $request->user()->id)
            ->select('id', 'first_name', 'last_name', 'email', 'phone', 'antecedentes_oftalmologicos', 'updated_at')
            ->findOrFail($id);

        return Inertia::render('patients/records/oftalmologicos', [
            'patient' => $patient,
        ]);
    }

    /**
     * Store a newly created patient in storage.
     */
    public function store(StorePatientRequest $request): RedirectResponse
    {
        $request->user()->patients()->create($request->validated());

        return redirect()->route('patients')->with('message', 'Paciente guardado exitosamente.');
    }

    /**
     * Update the specified patient in storage.
     */
    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        if ($patient->user_id !== $request->user()->id) {
            abort(403);
        }

        $patient->update($request->validated());

        return back()->with('message', 'Paciente actualizado exitosamente.');
    }
}
