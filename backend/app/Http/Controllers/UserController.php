<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
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
            'phone' => 'nullable|string|max:20',
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
            'phone' => 'nullable|string|max:20',
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

    /**
     * Reactivate the specified user account.
     */
    public function reactivate(User $user)

    {
        $user->status= 'active';
        $user->save();
        return response()->json(['message' => 'User reactivated', 'user' => $user], 200);
    }

    /**
     * Get the current authenticated user.
     */
    public function currentUser(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        return response()->json($user, 200);
    }

    /**
     * Update the current authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|nullable|string|max:20',
        ]);

        $user->update($validated);
        return response()->json($user, 200);
    }

    /**
     * Change the current authenticated user's password.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8',
        ]);

        // Check if current password is correct
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        // Update password
        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    public function getAllTrainers()
    {
        $trainers = User::where('role', UserRole::TRAINER)
                       ->where('status', UserStatus::ACTIVE)
                       ->get();

        return response()->json($trainers, 200);
    }

public function getUserCount()
{
    $count = User::count();
    return response()->json(['count' => $count], 200);

}

public function getUsersStatistics()
{
    $totalUsers = User::count();
    $activeUsers = User::where('status', UserStatus::ACTIVE)->count();
    $inactiveUsers = User::where('status', UserStatus::INACTIVE)->count();
    $bannedUsers = User::where('status', UserStatus::BANNED)->count();

    $roles = [];
    foreach (UserRole::values() as $role) {
        $roles[$role] = User::where('role', $role)->count();
    }

    $stats = [
        'total_users' => $totalUsers,
        'active_users' => $activeUsers,
        'inactive_users' => $inactiveUsers,
        'banned_users' => $bannedUsers,
        'roles' => $roles,
    ];

    return response()->json($stats, 200);
}
}
