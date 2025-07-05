<?php

namespace App\Http\Controllers;

use App\Models\TrainingSession;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'location' => 'required|string|max:255',
            'max_participants' => 'required|integer|min:1',
            'skill_name' => 'required|string|max:255',
            'skill_description' => 'nullable|string|max:1000',
        ]);
        
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
     * Remove the specified resource from storage.
     */
    public function destroy(TrainingSession $trainingSession)
    {
        $trainingSession->delete();
        return response()->json(null, 204);
    }
}
