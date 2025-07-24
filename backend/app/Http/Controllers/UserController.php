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
            'profile_picture' => 'nullable', // Accepts string or file
        ]);

        \Log::info('UserController update called', [
            'hasFile' => $request->hasFile('profile_picture'),
            'filled' => $request->filled('profile_picture'),
            'file' => $request->file('profile_picture'),
            'file_is_valid' => $request->hasFile('profile_picture') ? $request->file('profile_picture')->isValid() : null,
            'file_type' => $request->hasFile('profile_picture') ? $request->file('profile_picture')->getMimeType() : null,
            'file_size' => $request->hasFile('profile_picture') ? $request->file('profile_picture')->getSize() : null,
            'file_name' => $request->hasFile('profile_picture') ? $request->file('profile_picture')->getClientOriginalName() : null,
            'input_profile_picture' => $request->input('profile_picture'),
            'all_inputs' => $request->all(),
        ]);

        // Handle profile picture upload or direct URL
        if ($request->hasFile('profile_picture')) {
            \Log::info('Profile picture file detected, calling ImageService', [
                'file_path' => $request->file('profile_picture')->getPathname(),
                'file_mime' => $request->file('profile_picture')->getMimeType(),
                'file_size' => $request->file('profile_picture')->getSize(),
            ]);
            $imageService = app(\App\Services\ImageService::class);
            $filePath = $request->file('profile_picture')->getPathname();
            $imgbbUrl = $imageService->uploadToImgbb($filePath);
            \Log::info('ImageService returned URL', ['imgbbUrl' => $imgbbUrl]);
            $validated['profile_picture'] = $imgbbUrl;
        } elseif ($request->filled('profile_picture')) {
            \Log::info('Profile picture field filled, using direct URL', [
                'profile_picture' => $request->input('profile_picture')
            ]);
            $validated['profile_picture'] = $request->input('profile_picture');
        }

        \Log::info('UserController update final validated', $validated);
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

        // Extra debug: log headers and raw input
        \Log::info('updateProfile request headers', [
            'headers' => $request->headers->all(),
            'content_type' => $request->header('Content-Type'),
        ]);
        \Log::info('updateProfile all request input', [
            'all' => $request->all(),
            'files' => $request->files->all(),
        ]);
        // Extra debug: log raw body and PHP superglobals
        \Log::info('updateProfile raw body', [
            'php_input' => file_get_contents('php://input'),
            '_POST' => $_POST,
            '_FILES' => $_FILES,
            'getContent' => $request->getContent(),
        ]);

        // Call the update method for unified logic
        return $this->update($request, $user);
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

    public function getAllCoordinators()
    {
        $coordinators = User::where('role', UserRole::COORDINATOR)
                           ->where('status', UserStatus::ACTIVE)
                           ->get();

        return response()->json($coordinators, 200);
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
