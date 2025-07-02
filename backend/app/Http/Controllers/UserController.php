<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Enums\UserStatus;
use App\Enums\UserRole;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'status' => 'required|in:'.implode(',', UserStatus::values()),
            'role' => 'required|in:'.implode(',', UserRole::values()),
        ]);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return response()->json($user, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|required|string|min:8',
            'status' => 'sometimes|required|in:'.implode(',', UserStatus::values()),
            'role' => 'sometimes|required|in:'.implode(',', UserRole::values()),
        ]);
        $user->update($validated);
        return response()->json($user, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    /**
     * Ban the specified user account.
     */
    public function ban(User $user)
    {
        $user->status = 'banned';
        $user->save();
        return response()->json(['message' => 'User banned', 'user' => $user], 200);
    }

    /**
     * Set the specified user account as inactive.
     */
    public function deactivate(User $user)
    {
        $user->status = 'inactive';
        $user->save();
        return response()->json(['message' => 'User set to inactive', 'user' => $user], 200);
    }
}
