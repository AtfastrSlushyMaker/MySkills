<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Feedback::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'training_session_id' => 'required|exists:training_sessions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Validate that registration belongs to the specified training session
        $registration = \App\Models\Registration::find($validated['registration_id']);
        if ($registration->training_session_id != $validated['training_session_id']) {
            return response()->json([
                'message' => 'Registration does not belong to the specified training session'
            ], 422);
        }
        $feedback = Feedback::create($validated);
        return response()->json($feedback, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Feedback $feedback)
    {
        return response()->json($feedback, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'training_session_id' => 'sometimes|required|exists:training_sessions,id',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comments' => 'sometimes|nullable|string|max:1000',
        ]);
        $feedback->update($validated);
        return response()->json($feedback, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feedback $feedback)
    {
        $feedback->delete();
        return response()->json(null, 204);
    }
}
