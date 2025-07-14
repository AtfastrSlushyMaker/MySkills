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
        $feedbacks = Feedback::with('registration.user')->get();
        $result = $feedbacks->map(function($fb) {
            $user = $fb->user;
            return [
                'id' => $fb->id,
                'comment' => $fb->comment,
                'rating' => $fb->rating,
                'user' => $user ? [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name
                ] : null
            ];
        });
        return response()->json($result, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_id' => 'required|exists:registrations,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
        $feedback = Feedback::create($validated);
        return response()->json($feedback, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Feedback $feedback)
    {
        $feedback->load('registration.user');
        $user = $feedback->user;
        $result = [
            'id' => $feedback->id,
            'comment' => $feedback->comment,
            'rating' => $feedback->rating,
            'user' => $user ? [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name
            ] : null
        ];
        return response()->json($result, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feedback $feedback)
    {
        $validated = $request->validate([
            'registration_id' => 'sometimes|required|exists:registrations,id',
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'comment' => 'sometimes|nullable|string|max:1000',
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

    /**
     * Get feedback for a specific training session
     */
    public function getFeedbackBySession($sessionId)
    {
        $feedbacks = Feedback::whereHas('registration', function ($query) use ($sessionId) {
            $query->where('training_session_id', $sessionId);
        })->with('registration.user')->get();
        $result = $feedbacks->map(function($fb) {
            $user = $fb->user;
            return [
                'id' => $fb->id,
                'comment' => $fb->comment,
                'rating' => $fb->rating,
                'user' => $user ? [
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name
                ] : null
            ];
        });
        return response()->json($result, 200);
    }
    /**
     * Get feedback by user
     */
    public function getFeedbackByUser($userId)
    {
        $feedback = Feedback::whereHas('registration.user', function ($query) use ($userId) {
            $query->where('id', $userId);
        })->with('registration.trainingSession')->get();
        return response()->json($feedback, 200);
    }
}
