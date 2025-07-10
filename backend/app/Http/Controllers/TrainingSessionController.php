<?php

namespace App\Http\Controllers;

use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Enums\TrainingSessionStatus;

class TrainingSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sessions = TrainingSession::with(['category', 'trainer', 'coordinator', 'trainingCourses'])
                                    ->get();
        return response()->json($sessions, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'coordinator_id' => 'required|exists:users,id',
            'trainer_id' => 'required|exists:users,id',
            'date' => 'required|date',//start date
            'end_date' => 'nullable|date|after_or_equal:date', //end date
            'start_time' => 'required|date_format:H:i',// start time
            'end_time' => 'required|date_format:H:i',// end time
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'skill_name' => 'required|string|max:255',
            'skill_description' => 'nullable|string|max:1000',
        ]);

        // Custom validation: end datetime must be after start datetime
        $startDateTime = strtotime($validated['date'] . ' ' . $validated['start_time']);
        $endDateTime = strtotime(($validated['end_date'] ?? $validated['date']) . ' ' . $validated['end_time']);
        if ($endDateTime <= $startDateTime) {
            return response()->json([
                'message' => 'The end date/time must be after the start date/time.',
                'errors' => [
                    'end_date' => ['The end date/time must be after the start date/time.'],
                    'end_time' => ['The end date/time must be after the start date/time.']
                ]
            ], 422);
        }

        // Set default status to active for new sessions
        $validated['status'] = TrainingSessionStatus::ACTIVE;

        $session = TrainingSession::create($validated);
        return response()->json($session->load(['category', 'trainer', 'coordinator']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TrainingSession $trainingSession)
    {
        $trainingSession->load(['category', 'trainer', 'coordinator', 'trainingCourses', 'registrations']);
        return response()->json($trainingSession, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrainingSession $trainingSession)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'coordinator_id' => 'sometimes|required|exists:users,id',
            'trainer_id' => 'sometimes|required|exists:users,id',
            'date' => 'sometimes|required|date',
            'end_date' => 'sometimes|nullable|date|after_or_equal:date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'location' => 'sometimes|required|string|max:255',
            'max_participants' => 'sometimes|required|integer|min:1',
            'skill_name' => 'sometimes|required|string|max:255',
            'skill_description' => 'sometimes|nullable|string|max:1000',
        ]);

        $trainingSession->update($validated);
        return response()->json($trainingSession->load(['category', 'trainer', 'coordinator']), 200);
    }

    /**
     * Archive (soft-delete) a session by coordinator.
     */
    public function archiveByCoordinator(Request $request, TrainingSession $trainingSession)
    {
        // Optionally, check if the user is the coordinator (auth logic can be added here)
        $trainingSession->status = TrainingSessionStatus::ARCHIVED;
        $trainingSession->save();
        return response()->json(['message' => 'Session archived successfully.'], 200);
    }

    /**
     * Remove the specified resource from storage (admin only).
     */
    public function destroy(TrainingSession $trainingSession)
    {
        // Optionally, check if the user is admin (auth logic can be added here)
        $trainingSession->delete();
        return response()->json(null, 204);
    }

    public function getSessionsByTrainer($trainerId)
    {
        $sessions = TrainingSession::where('trainer_id', $trainerId)
                                    ->with(['category', 'coordinator',"trainingCourses"])
                                    ->get();
        return response()->json($sessions, 200);
    }

    public function getSessionsByCoordinator($coordinatorId)
    {
        $sessions = TrainingSession::where('coordinator_id', $coordinatorId)
                                    ->with(['category', 'trainer', 'trainingCourses'])
                                    ->get();
        return response()->json($sessions, 200);
    }
    public function getSessionsByCategory($categoryId)
    {
        $sessions = TrainingSession::where('category_id', $categoryId)
                                    ->with(['trainer', 'coordinator', 'trainingCourses'])
                                    ->get();
        return response()->json($sessions, 200);
    }

    public function RecentActivityByCoordinator(int $coordinatorId)
    {
        // Get recent sessions
        $sessions = TrainingSession::where('coordinator_id', $coordinatorId)
                                    ->with(['category', 'trainer', 'trainingCourses'])
                                    ->orderBy('updated_at', 'desc')
                                    ->take(8)
                                    ->get();

        // Get recent registrations for coordinator's sessions
        $registrations = \App\Models\Registration::whereHas('trainingSession', function($query) use ($coordinatorId) {
                                $query->where('coordinator_id', $coordinatorId);
                            })
                            ->with(['trainingSession.category', 'user'])
                            ->orderBy('updated_at', 'desc')
                            ->take(5)
                            ->get();

        $activities = collect();

        // Add session activities
        foreach ($sessions as $session) {
            $timeDiff = now()->diffInHours($session->updated_at);

            // Determine activity type based on session properties
            $activityType = 'session_created';
            $description = 'Created new training session';

            if ($session->status === TrainingSessionStatus::ACTIVE) {
                if ($timeDiff < 48 && $session->created_at != $session->updated_at) {
                    $activityType = 'session_updated';
                    $description = 'Updated session details';
                } else {
                    $activityType = 'session_active';
                    $description = 'Training session is active';
                }
            } elseif ($session->status === TrainingSessionStatus::ARCHIVED) {
                $activityType = 'session_archived';
                $description = 'Archived training session';
            }

            $activities->push([
                'type' => $activityType,
                'description' => $description,
                'details' => ($session->category ? $session->category->name : 'Training') .
                           ' - ' . ($session->trainer ? $session->trainer->name : 'No trainer assigned'),
                'created_at' => $session->updated_at->toISOString(),
                'session_id' => $session->id
            ]);
        }

        // Add registration activities
        foreach ($registrations as $registration) {
            $activityType = 'registration_approved';
            $description = 'Approved participant registration';

            if ($registration->status === 'rejected') {
                $activityType = 'registration_rejected';
                $description = 'Rejected registration request';
            } elseif ($registration->status === 'pending') {
                $activityType = 'registration_pending';
                $description = 'New registration request received';
            }

            $activities->push([
                'type' => $activityType,
                'description' => $description,
                'details' => ($registration->user ? $registration->user->name : 'Unknown user') .
                           ' - ' . ($registration->trainingSession->category ? $registration->trainingSession->category->name : 'Training'),
                'created_at' => $registration->updated_at->toISOString(),
                'session_id' => $registration->training_session_id
            ]);
        }

        // Sort all activities by date and take the most recent ones
        $sortedActivities = $activities->sortByDesc('created_at')->take(8)->values();

        return response()->json([
            'success' => true,
            'activities' => $sortedActivities
        ], 200);
    }


}

