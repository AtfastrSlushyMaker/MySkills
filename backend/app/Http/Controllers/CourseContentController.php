<?php

namespace App\Http\Controllers;

use App\Models\CourseContent;
use Illuminate\Http\Request;
use App\Services\ImageService;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

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
            'type' => 'required|string|in:text,image,video,file',
        ];

        if ($type === 'image') {
            $rules['content'] = 'required|file|image|max:5120'; // 5MB max
        } else {
            $rules['content'] = 'nullable|string';
        }

        try {
            $validated = $request->validate($rules);
            $imageService = new ImageService();

            if ($type === 'image') {
                $validated['content'] = $imageService->uploadToImgbb($request->file('content')->getPathname());
                // ...existing code...
            }

            $courseContent = CourseContent::create($validated);
            // ...existing code...

            return response()->json($courseContent, 201);
        } catch (ValidationException $e) {
            Log::error('CourseContentController@store: validation failed', ['errors' => $e->errors()]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('CourseContentController@store: unexpected error', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create course content'], 500);
        }
    }

    public function show($id)
    {
        $courseContent = CourseContent::with([
            'trainingCourse',
            'trainingCourse.trainingSession.trainer',
            'trainingCourse.trainingSession.coordinator'
        ])->findOrFail($id);

        return response()->json($courseContent);
    }

    public function update(Request $request, $id)
    {


        // Manually find the model to avoid route model binding issues
        $courseContent = CourseContent::findOrFail($id);


        // Get the type from request or fallback to existing model type
        $type = $request->input('type', $courseContent->type);

        // Base validation rules
        $rules = [
            'type' => 'sometimes|string|in:text,image,video,file',
            'training_course_id' => 'sometimes|exists:training_courses,id',
        ];

        // Type-specific validation
        if ($type === 'image') {
            if ($request->hasFile('content')) {
                $rules['content'] = 'required|file|image';
            } else {
                $rules['content'] = 'sometimes|string'; // Allow string URLs for existing images
            }
        } else {
            $rules['content'] = 'nullable|string';
        }

        try {
            $validated = $request->validate($rules);

            // Ensure we have the training_course_id
            if (!isset($validated['training_course_id'])) {
                $validated['training_course_id'] = $courseContent->training_course_id;
            }

            // Set the type
            $validated['type'] = $type;

            // Handle file upload for images
            $imageService = new ImageService();
            if ($type === 'image' && $request->hasFile('content')) {
                $file = $request->file('content');


                $validated['content'] = $imageService->uploadToImgbb($file->getPathname());
                // ...existing code...
            } elseif ($type === 'image' && $request->filled('content')) {
                // Keep existing URL if provided as string
                $validated['content'] = $request->input('content');
                // ...existing code...
            } elseif ($type !== 'image') {
                // For non-image types, use the content as-is
                $validated['content'] = $request->input('content', $courseContent->content);
            }


            $courseContent->update($validated);
            $courseContent->refresh();

            return response()->json($courseContent->load([
                'trainingCourse',
                'trainingCourse.trainingSession.trainer',
                'trainingCourse.trainingSession.coordinator'
            ]), 200);

        } catch (ValidationException $e) {
            Log::error('CourseContentController@update: validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('CourseContentController@update: unexpected error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to update course content'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $courseContent = CourseContent::findOrFail($id);
            $courseContent->delete();
            // ...existing code...
            return response()->noContent();
        } catch (\Exception $e) {
            Log::error('CourseContentController@destroy: failed to delete', [
                'id' => $id,
                'message' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Failed to delete course content'], 500);
        }
    }
}
