<?php

namespace App\Http\Controllers;

use App\Models\CourseContent;
use Illuminate\Http\Request;
use App\Services\imageService;

class CourseContentController extends Controller
{
    public function index()
    {
        return CourseContent::with(
            'trainingCourse',
            'trainingCourse.trainingSession.trainer',
            'trainingCourse.trainingSession.coordinator'
        )
            ->when(request('training_course_id'), function ($query) {
                $query->where('training_course_id', request('training_course_id'));
            })
            ->get();
    }

    public function store(Request $request)
    {
        $type = $request->input('type');
        $rules = [
            'training_course_id' => 'required|exists:training_courses,id',
            'type' => 'required|string',
        ];
        if ($type === 'image') {
            $rules['content'] = 'required|file|image|max:5120'; // 5MB max
        } else {
            $rules['content'] = 'nullable|string';
        }
        $validated = $request->validate($rules);
        $imageService = new imageService();
        if ($type === 'image') {
            $validated['content'] = $imageService->uploadToImgbb($request->file('content'));
        }

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
