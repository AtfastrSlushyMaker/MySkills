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
        return response()->json(TrainingCourse::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'duration' => 'required|integer|min:1', // Duration in hours
            'is_active' => 'boolean',
            'category_id' => 'required|exists:categories,id', // Assuming a category relationship
            // Add any other validation rules as necessary
        ]);
        $course = TrainingCourse::create($validated);
        return response()->json($course, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TrainingCourse $trainingCourse)
    {
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
            'duration' => 'sometimes|required|integer|min:1', // Duration in hours
            'is_active' => 'sometimes|boolean',
            'category_id' => 'sometimes|required|exists:categories,id', // Assuming a category relationship
            // Add any other validation rules as necessary
        ]);
        $trainingCourse->update($validated);
        return response()->json($trainingCourse, 200);
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
