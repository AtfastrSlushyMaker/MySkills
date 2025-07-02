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
        return response()->json(TrainingSession::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'training_course_id' => 'required|exists:training_courses,id', // Assuming a training course relationship
            'is_active' => 'boolean',
        ]);
        $session = TrainingSession::create($validated);
        return response()->json($session, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TrainingSession $trainingSession)
    {
        return response()->json($trainingSession, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrainingSession $trainingSession)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'training_course_id' => 'sometimes|required|exists:training_courses,id', // Assuming a training course relationship
            'is_active' => 'sometimes|boolean',

        ]);
        $trainingSession->update($validated);
        return response()->json($trainingSession, 200);
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
