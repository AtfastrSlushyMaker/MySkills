<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->notExpired()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $user->unreadNotifications()->count()
        ]);
    }

    /**
     * Get only unread notifications for the authenticated user.
     */
    public function unread(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $notifications = $user->unreadNotifications()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'count' => $notifications->count()
        ]);
    }

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

        $notification = Notification::create($request->all());

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

        $notificationData = $request->except('user_ids');
        $notifications = [];

        foreach ($request->user_ids as $userId) {
            $notifications[] = Notification::create(array_merge($notificationData, [
                'user_id' => $userId
            ]));
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
