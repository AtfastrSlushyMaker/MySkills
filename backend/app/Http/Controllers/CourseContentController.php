<?php

namespace App\Http\Controllers;

use App\Models\CourseContent;
use Illuminate\Http\Request;

class CourseContentController extends Controller
{
    public function index()
    {
        return CourseContent::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'training_course_id' => 'required|exists:training_courses,id',
            'content' => 'nullable|string',
            'type' => 'required|string',
        ]);
        return CourseContent::create($validated);
    }

    public function show(CourseContent $courseContent)
    {
        return $courseContent;
    }

    public function update(Request $request, CourseContent $courseContent)
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'type' => 'sometimes|required|string',
        ]);
        $courseContent->update($validated);
        return $courseContent;
    }

    public function destroy(CourseContent $courseContent)
    {
        $courseContent->delete();
        return response()->noContent();
    }
}
