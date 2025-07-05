<?php

namespace App\Http\Controllers;

use App\Models\TrainingCourse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrainingCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = TrainingCourse::with(['trainingSession', 'creator'])
                                 ->get();
        return response()->json($courses, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'duration_hours' => 'required|integer|min:1',
            'max_participants' => 'required|integer|min:1',
            'training_session_id' => 'required|exists:training_sessions,id',
            'created_by' => 'required|exists:users,id',
            'is_active' => 'boolean',
        ]);
        
        $course = TrainingCourse::create($validated);
        return response()->json($course->load(['trainingSession', 'creator']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TrainingCourse $trainingCourse)
    {
        $trainingCourse->load(['trainingSession', 'creator', 'attendances']);
        return response()->json($trainingCourse, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrainingCourse $trainingCourse)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
            'duration_hours' => 'sometimes|required|integer|min:1',
            'max_participants' => 'sometimes|required|integer|min:1',
            'training_session_id' => 'sometimes|required|exists:training_sessions,id',
            'created_by' => 'sometimes|required|exists:users,id',
            'is_active' => 'sometimes|boolean',
        ]);
        
        $trainingCourse->update($validated);
        return response()->json($trainingCourse->load(['trainingSession', 'creator']), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrainingCourse $trainingCourse)
    {
        $trainingCourse->delete();
        return response()->json(null, 204);
    }
}
