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

    /**
     * Approve a registration (Coordinator function)
     */
    public function approve(Registration $registration)
    {
        if($registration->trainingSession->coordinator_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not authorized to approve this registration'
            ], Response::HTTP_FORBIDDEN);
        }
        $registration->status = RegistrationStatus::CONFIRMED;
        $registration->save();

        return response()->json([
            'message' => 'Registration approved successfully',
            'registration' => $registration->load(['user', 'trainingSession'])
        ], 200);
    }

    /**
     * Reject a registration (Coordinator function)
     */
    public function reject(Registration $registration)
    {
        if($registration->trainingSession->coordinator_id !== auth()->id()) {
            return response()->json([
                'message' => 'You are not authorized to reject this registration'
            ], Response::HTTP_FORBIDDEN);
        }
        $registration->status = RegistrationStatus::CANCELLED;
        $registration->save();

        return response()->json([
            'message' => 'Registration rejected',
            'registration' => $registration->load(['user', 'trainingSession'])
        ], 200);
    }

    /**
     * Get all pending registrations for coordinator review
     */
    public function pending()
    {
        $pendingRegistrations = Registration::with(['user', 'trainingSession.category'])
            ->where('status', RegistrationStatus::PENDING)
            ->whereHas('trainingSession', function($query) {
        $query->where('coordinator_id', auth()->id());
    })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'message' => 'Pending registrations retrieved successfully',
            'registrations' => $pendingRegistrations,
            'count' => $pendingRegistrations->count()
        ], 200);
    }

    /**
     * Get registrations for a specific training session
     */
    public function bySession($sessionId)
    {
        $registrations = Registration::with(['user'])
            ->where('training_session_id', $sessionId)
            ->whereHas('trainingSession', function($query) {
        $query->where('coordinator_id', auth()->id());
    })
            ->get();

        return response()->json([
            'message' => 'Session registrations retrieved successfully',
            'registrations' => $registrations,
            'count' => $registrations->count()
        ], 200);
    }

    /**
     * Get registration statistics for coordinator dashboard
     */
    public function stats()
{
    $coordinatorId = auth()->id();

    $stats = [
        'total' => Registration::whereHas('trainingSession', function($query) use ($coordinatorId) {
            $query->where('coordinator_id', $coordinatorId);
        })->count(),

        'pending' => Registration::whereHas('trainingSession', function($query) use ($coordinatorId) {
            $query->where('coordinator_id', $coordinatorId);
        })->where('status', RegistrationStatus::PENDING)->count(),

        'confirmed' => Registration::whereHas('trainingSession', function($query) use ($coordinatorId) {
            $query->where('coordinator_id', $coordinatorId);
        })->where('status', RegistrationStatus::CONFIRMED)->count(),

        'cancelled' => Registration::whereHas('trainingSession', function($query) use ($coordinatorId) {
            $query->where('coordinator_id', $coordinatorId);
        })->where('status', RegistrationStatus::CANCELLED)->count(),
    ];

    return response()->json([
        'message' => 'Registration statistics retrieved successfully',
        'stats' => $stats
    ], 200);
}
}
