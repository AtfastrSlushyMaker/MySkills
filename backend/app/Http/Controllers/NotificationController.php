<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Services\NotificationService;
use App\Enums\UserRole;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    protected NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    /**
     * List all notifications (admin only).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated',
                'debug' => 'No user found',
                'token' => $request->bearerToken(),
            ], 401);
        }
        if (!$user->isAdmin()) {
            return response()->json([
                'error' => 'Forbidden',
                'debug' => $user->toArray(),
                'token' => $request->bearerToken(),
            ], 403);
        }
        $notifications = Notification::with('user')->orderByDesc('created_at')->get();
        return response()->json(['notifications' => $notifications], 200);
    }

    /**
     * Show a specific notification (admin:any, user:own).
     */
    public function show(Request $request, Notification $notification): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        if ($user->role !== UserRole::ADMIN->value && $notification->user_id !== $user->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        $notification->load('user');
        return response()->json(['notification' => $notification], 200);
    }

    /**
     * Get all notifications for the authenticated user (not admin).
     */
    public function userNotifications(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        if ($user->role === UserRole::ADMIN->value) {
            return response()->json(['error' => 'Forbidden'], 403);
        }
        $notifications = Notification::with('user')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();
        return response()->json(['notifications' => $notifications], 200);
    }

    // ...existing code for unread, markAsRead, markAllAsRead, destroy, store, broadcast, stats...

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        // Ensure user can only mark their own notifications
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read',
            'notification' => $notification->fresh()
        ]);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        $updated = $user->unreadNotifications()->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return response()->json([
            'message' => "Marked {$updated} notifications as read"
        ]);
    }

    /**
     * Delete a specific notification.
     */
    public function destroy(Request $request, Notification $notification): JsonResponse
    {
        // Ensure user can only delete their own notifications
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully'
        ]);
    }

    /**
     * Create a new notification (for admins/system).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'sometimes|in:low,normal,high,urgent',
            'action_url' => 'nullable|url',
            'icon' => 'nullable|string',
            'expires_at' => 'nullable|date|after:now'
        ]);

        $user = User::findOrFail($request->user_id);
        // Use the NotificationService's generic creation logic for custom notifications
        $notification = $this->notificationService->sendCustomNotification(
            $user,
            $request->type,
            $request->title,
            $request->message,
            $request->input('priority', 'normal'),
            $request->input('action_url'),
            $request->input('icon'),
            $request->input('expires_at'),
            $request->input('data', [])
        );

        return response()->json([
            'message' => 'Notification created successfully',
            'notification' => $notification
        ], 201);
    }

    /**
     * Send notification to multiple users.
     */
    public function broadcast(Request $request): JsonResponse
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'type' => 'required|string',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'sometimes|in:low,normal,high,urgent',
            'action_url' => 'nullable|url',
            'icon' => 'nullable|string',
            'expires_at' => 'nullable|date|after:now'
        ]);

        $notifications = [];
        foreach ($request->user_ids as $userId) {
            $user = User::findOrFail($userId);
            $notifications[] = $this->notificationService->sendCustomNotification(
                $user,
                $request->type,
                $request->title,
                $request->message,
                $request->input('priority', 'normal'),
                $request->input('action_url'),
                $request->input('icon'),
                $request->input('expires_at'),
                $request->input('data', [])
            );
        }

        return response()->json([
            'message' => 'Notifications sent to ' . count($notifications) . ' users',
            'notifications' => $notifications
        ], 201);
    }

    /**
     * Get notification statistics for admin dashboard.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_notifications' => Notification::count(),
            'unread_notifications' => Notification::unread()->count(),
            'high_priority_unread' => Notification::unread()->highPriority()->count(),
            'notifications_today' => Notification::whereDate('created_at', today())->count(),
            'notifications_this_week' => Notification::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
        ];

        return response()->json($stats);
    }
}
