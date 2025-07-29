<?php

namespace App\Http\Controllers;

use App\Models\Registration;
use App\Models\SessionCompletion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Models\TrainingSession;
use App\Models\User;
use App\Http\Controllers\CertController;

class SessionCompletionController extends Controller
{
    /**
     * Display a listing of session completions.
     */
    public function index(Request $request): JsonResponse
    {
        $query = SessionCompletion::with(['registration.user', 'trainingSession']);

        // Filter by user if provided
        if ($request->has('user_id')) {
            $query->whereHas('registration', function ($q) use ($request) {
                $q->where('user_id', $request->user_id);
            });
        }

        // Filter by training session if provided
        if ($request->has('training_session_id')) {
            $query->where('training_session_id', $request->training_session_id);
        }

        // Filter by skill earned
        if ($request->has('skill_earned')) {
            $query->where('skill_earned', $request->skill_earned);
        }

        // Filter by completion status
        if ($request->has('completed')) {
            if ($request->boolean('completed')) {
                $query->whereNotNull('completed_at');
            } else {
                $query->whereNull('completed_at');
            }
        }

        $completions = $query->orderBy('completed_at', 'desc')->paginate(15);

        return response()->json($completions);
    }

    /**
     * Store a newly created session completion.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'training_session_id' => 'required|exists:training_sessions,id',
            'courses_completed' => 'nullable|integer|min:0',
            'total_courses' => 'nullable|integer|min:0',
            'completion_notes' => 'nullable|string|max:1000',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'certificate_issued' => 'nullable|boolean',
            'certificate_url' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:in_progress,completed,failed',
        ]);

        // Validate that registration belongs to the specified training session
        $registration = Registration::find($validated['registration_id']);
        if ($registration->training_session_id != $validated['training_session_id']) {
            return response()->json([
                'message' => 'Registration does not belong to the specified training session'
            ], 422);
        }

        // Check if session completion already exists for this registration
        $existingCompletion = SessionCompletion::where('registration_id', $validated['registration_id'])->first();

        if ($existingCompletion) {
            return response()->json([
                'message' => 'Session completion already exists for this registration'
            ], 409);
        }

        // Get registration to validate it's confirmed
        $registration = Registration::find($validated['registration_id']);

        if (!$registration->isConfirmed()) {
            return response()->json([
                'message' => 'Registration must be confirmed before creating completion record'
            ], 422);
        }


        $validated['started_at'] = now();
        $completion = SessionCompletion::create($validated);

        // Auto-generate certificate if completed and not already issued
        if ($completion->isCompleted() && !$completion->certificate_issued) {
            $certController = app(CertController::class);
            $certController->generateCertificate(request(), $completion);
            $completion->refresh();
        }

        return response()->json([
            'message' => 'Session completion created successfully',
            'data' => $completion->load(['registration.user', 'trainingSession'])
        ], 201);
    }

    /**
     * Display the specified session completion.
     */
    public function show(SessionCompletion $sessionCompletion): JsonResponse
    {
        return response()->json([
            'data' => $sessionCompletion->load(['registration.user', 'trainingSession'])
        ]);
    }

    /**
     * Update the specified session completion.
     */
    public function update(Request $request, SessionCompletion $sessionCompletion): JsonResponse
    {
        $validated = $request->validate([
            'courses_completed' => 'nullable|integer|min:0',
            'total_courses' => 'nullable|integer|min:0',
            'completion_notes' => 'nullable|string|max:1000',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'certificate_issued' => 'nullable|boolean',
            'certificate_url' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:in_progress,completed,failed',
        ]);

        $sessionCompletion->update($validated);

        // Auto-generate certificate if completed and not already issued
        if ($sessionCompletion->isCompleted() && !$sessionCompletion->certificate_issued) {
            $certController = app(CertController::class);
            $certController->generateCertificate(request(), $sessionCompletion);
            $sessionCompletion->refresh();
        }

        return response()->json([
            'message' => 'Session completion updated successfully',
            'data' => $sessionCompletion->load(['registration.user', 'trainingSession'])
        ]);
    }

    /**
     * Mark session as completed.
     */
    public function markCompleted(Request $request, SessionCompletion $sessionCompletion): JsonResponse
    {
        $validated = $request->validate([
            'completion_notes' => 'nullable|string|max:1000',
            'completed_at' => 'nullable|date',
            'certificate_issued' => 'nullable|boolean',
            'certificate_url' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:in_progress,completed,failed',
        ]);

        if ($sessionCompletion->isCompleted()) {
            return response()->json([
                'message' => 'Session is already marked as completed'
            ], 422);
        }

        // Update additional fields if provided
        if (!empty($validated)) {
            $sessionCompletion->update($validated);
        }

        // Mark as completed
        $sessionCompletion->markAsCompleted($validated['skill_earned'] ?? null);

        return response()->json([
            'message' => 'Session marked as completed successfully',
            'data' => $sessionCompletion->fresh()->load(['registration.user', 'trainingSession'])
        ]);
    }

    /**
     * Generate certificate for completed session.
     */
    public function generateCertificate(SessionCompletion $sessionCompletion): JsonResponse
    {
        // Delegate to CertController for certificate generation logic
        $certController = app(CertController::class);
        return $certController->generateCertificate(request(), $sessionCompletion);
    }

    /**
     * Get session completions by registration.
     */
    public function getByRegistration(Registration $registration): JsonResponse
    {
        $completion = $registration->sessionCompletion;

        if (!$completion) {
            return response()->json([
                'message' => 'No session completion found for this registration'
            ], 404);
        }

        return response()->json([
            'data' => $completion
        ]);
    }

    /**
     * Get user's skills (completed sessions).
     */
    public function getUserSkills(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $skills = SessionCompletion::whereHas('registration', function ($query) use ($validated) {
            $query->where('user_id', $validated['user_id']);
        })
        ->whereNotNull('completed_at')
        ->whereNotNull('skill_earned')
        ->with(['registration', 'trainingSession'])
        ->get()
        ->map(function ($completion) {
            return [
                'skill_name' => $completion->skill_earned,
                'completed_at' => $completion->completed_at,
                'completion_percentage' => $completion->overall_completion_percentage,
                'final_score' => $completion->final_score,
                'certificate_issued' => $completion->certificate_issued,
                'certificate_url' => $completion->certificate_url,
                'training_session' => $completion->trainingSession->only(['id', 'date', 'location'])
            ];
        });

        return response()->json([
            'data' => $skills
        ]);
    }

    /**
     * Remove the specified session completion.
     */
    public function destroy(SessionCompletion $sessionCompletion): JsonResponse
    {
        $sessionCompletion->delete();

        return response()->json([
            'message' => 'Session completion deleted successfully'
        ]);
    }
}
