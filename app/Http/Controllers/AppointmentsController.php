<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AppointmentsController extends Controller
{
    public function index(Request $request)
    {
        // For the Inertia page load:
        if (! $request->wantsJson()) {
            // Retrieve patients so we can pick them in the UI when creating an appointment
            $patients = $request->user()->patients()->orderBy('first_name')->get(['id', 'first_name', 'last_name']);

            return Inertia::render('appointments/index', [
                'patients' => $patients,
            ]);
        }

        // For the calendar data fetching (JSON):
        // Expecting start and end dates from the calendar view
        $start = $request->query('start');
        $end = $request->query('end');

        // whereHas('patient') respects the patient's soft-delete scope, so
        // appointments of archived patients (their past ones stay in the DB)
        // never reach the calendar feed.
        $query = $request->user()->appointments()->with('patient:id,first_name,last_name')->whereHas('patient');

        if ($start) {
            $query->where('starts_at', '>=', Carbon::parse($start));
        }
        if ($end) {
            $query->where('ends_at', '<=', Carbon::parse($end));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            // exists() queries the table directly, so exclude soft-deleted
            // (archived) patients explicitly.
            'patient_id' => ['required', Rule::exists('patients', 'id')->where('user_id', $request->user()->id)->whereNull('deleted_at')],
            'title' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
        ]);

        $overlapping = $request->user()->appointments()
            ->where('starts_at', '<', Carbon::parse($validated['ends_at']))
            ->where('ends_at', '>', Carbon::parse($validated['starts_at']))
            ->exists();

        if ($overlapping) {
            return redirect()->back()->with('error', 'El horario seleccionado se superpone con otra cita existente.');
        }

        $appointment = $request->user()->appointments()->create($validated);

        return redirect()->back()->with('success', 'Cita creada exitosamente.');
    }

    public function update(Request $request, Appointment $appointment)
    {
        if ($appointment->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'patient_id' => ['sometimes', Rule::exists('patients', 'id')->where('user_id', $request->user()->id)->whereNull('deleted_at')],
            'title' => 'sometimes|string|max:255',
            'notes' => 'nullable|string',
            'starts_at' => 'sometimes|date',
            // 'after:starts_at' compares against request input only, which is
            // missing on partial updates (e.g. drag-and-drop sending just the
            // end time). Validate against the merged stored + incoming times.
            'ends_at' => ['sometimes', 'date', function ($attribute, $value, $fail) use ($request, $appointment) {
                $startsAt = $request->input('starts_at', $appointment->starts_at);

                if (Carbon::parse($value)->lessThanOrEqualTo(Carbon::parse($startsAt))) {
                    $fail('La fecha de fin debe ser posterior a la fecha de inicio.');
                }
            }],
        ]);

        $startsAt = isset($validated['starts_at']) ? Carbon::parse($validated['starts_at']) : Carbon::parse($appointment->starts_at);
        $endsAt = isset($validated['ends_at']) ? Carbon::parse($validated['ends_at']) : Carbon::parse($appointment->ends_at);

        $overlapping = $request->user()->appointments()
            ->where('id', '!=', $appointment->id)
            ->where('starts_at', '<', $endsAt)
            ->where('ends_at', '>', $startsAt)
            ->exists();

        if ($overlapping) {
            return redirect()->back()->with('error', 'El horario seleccionado se superpone con otra cita existente.');
        }

        $appointment->update($validated);

        return redirect()->back()->with('success', 'Cita actualizada exitosamente.');
    }

    public function destroy(Request $request, Appointment $appointment)
    {
        if ($appointment->user_id !== $request->user()->id) {
            abort(403);
        }

        $appointment->delete();

        return redirect()->back()->with('success', 'Cita eliminada exitosamente.');
    }
}
