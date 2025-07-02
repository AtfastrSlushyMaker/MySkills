<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Enums\RegistrationStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class RegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Registration::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'training_session_id' => 'required|exists:training_sessions,id',
            'registration_date' => 'required|date',
            'status' => 'required|in:'.implode(',', RegistrationStatus::values()),
        ]);
        $registration = Registration::create($validated);
        return response()->json($registration, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Registration $registration)
    {
        return response()->json($registration, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'training_session_id' => 'sometimes|required|exists:training_sessions,id',
            'registration_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:'.implode(',', RegistrationStatus::values()),
        ]);
        $registration->update($validated);
        return response()->json($registration, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Registration $registration)
    {
        $registration->delete();
        return response()->json(null, 204);
    }
}
