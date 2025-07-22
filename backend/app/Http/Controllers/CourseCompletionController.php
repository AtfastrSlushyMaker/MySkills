<?php

namespace App\Http\Controllers;

use App\Models\CourseCompletion;
use Illuminate\Http\Request;

class CourseCompletionController extends Controller
{
    public function index()
    {
        return CourseCompletion::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'training_course_id' => 'required|exists:training_courses,id',
            'status' => 'required|in:in_progress,completed',
            'completed_at' => 'nullable|date',
        ]);
        return CourseCompletion::create($validated);
    }

    public function show(CourseCompletion $courseCompletion)
    {
        return $courseCompletion;
    }

    public function update(Request $request, CourseCompletion $courseCompletion)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:in_progress,completed',
            'completed_at' => 'nullable|date',
        ]);
        $courseCompletion->update($validated);
        return $courseCompletion;
    }

    public function destroy(CourseCompletion $courseCompletion)
    {
        $courseCompletion->delete();
        return response()->noContent();
    }
}
