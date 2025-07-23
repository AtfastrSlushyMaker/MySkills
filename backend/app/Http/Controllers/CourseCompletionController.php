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
            'completed_at' => 'required',
        ]);

        // Convert completed_at to MySQL datetime format
        try {
            $validated['completed_at'] = \Carbon\Carbon::parse($validated['completed_at'])->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid completed_at format'], 422);
        }

        // Check for existing record
        $existing = CourseCompletion::where('user_id', $validated['user_id'])
            ->where('training_course_id', $validated['training_course_id'])
            ->first();
        if ($existing) {
            $existing->update($validated);
            return $existing;
        }
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
