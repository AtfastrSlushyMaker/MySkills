<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\TrainingCourse;
use App\Models\TrainingSession;
use App\Models\Registration;

class NotificationService
{
    /**
     * Send a course reminder notification.
     */
    public function sendCourseReminder(User $user, TrainingCourse $course, TrainingSession $session): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'course_reminder',
            'title' => 'Training Session Tomorrow',
            'message' => "Don't forget about your {$course->title} session tomorrow at {$session->start_time->format('H:i')}",
            'data' => [
                'course_id' => $course->id,
                'session_id' => $session->id,
            ],
            'priority' => 'normal',
            'action_url' => "/courses/{$course->id}/sessions/{$session->id}",
            'icon' => '📚',
        ]);
    }

    /**
     * Send a registration confirmation notification.
     */
    public function sendRegistrationConfirmation(User $user, TrainingCourse $course): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'registration_confirmed',
            'title' => 'Registration Confirmed',
            'message' => "You have successfully registered for {$course->title}",
            'data' => [
                'course_id' => $course->id,
            ],
            'priority' => 'normal',
            'action_url' => "/courses/{$course->id}",
            'icon' => '✅',
        ]);
    }

    /**
     * Send a session update notification.
     */
    public function sendSessionUpdate(User $user, TrainingSession $session, string $updateType): Notification
    {
        $messages = [
            'time_changed' => "The time for {$session->trainingCourse->title} session has been updated",
            'location_changed' => "The location for {$session->trainingCourse->title} session has been changed",
            'cancelled' => "The {$session->trainingCourse->title} session has been cancelled",
            'rescheduled' => "The {$session->trainingCourse->title} session has been rescheduled",
        ];

        $priorities = [
            'cancelled' => 'high',
            'rescheduled' => 'high',
            'time_changed' => 'normal',
            'location_changed' => 'normal',
        ];

        return Notification::create([
            'user_id' => $user->id,
            'type' => 'session_update',
            'title' => 'Session Update',
            'message' => $messages[$updateType] ?? 'Session details have been updated',
            'data' => [
                'session_id' => $session->id,
                'course_id' => $session->training_course_id,
                'update_type' => $updateType,
            ],
            'priority' => $priorities[$updateType] ?? 'normal',
            'action_url' => "/courses/{$session->training_course_id}/sessions/{$session->id}",
            'icon' => $updateType === 'cancelled' ? '❌' : '🔄',
        ]);
    }

    /**
     * Send a new course notification.
     */
    public function sendNewCourseNotification(User $user, TrainingCourse $course): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'new_course',
            'title' => 'New Course Available',
            'message' => "A new course '{$course->title}' is now available for registration",
            'data' => [
                'course_id' => $course->id,
            ],
            'priority' => 'normal',
            'action_url' => "/courses/{$course->id}",
            'icon' => '🎓',
        ]);
    }

    /**
     * Send a feedback request notification.
     */
    public function sendFeedbackRequest(User $user, TrainingSession $session): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'feedback_request',
            'title' => 'Feedback Requested',
            'message' => "Please provide feedback for the {$session->trainingCourse->title} session",
            'data' => [
                'session_id' => $session->id,
                'course_id' => $session->training_course_id,
            ],
            'priority' => 'normal',
            'action_url' => "/feedback/session/{$session->id}",
            'icon' => '💬',
            'expires_at' => now()->addDays(7), // Expire after 7 days
        ]);
    }

    /**
     * Send a deadline approaching notification.
     */
    public function sendDeadlineApproaching(User $user, TrainingCourse $course, int $daysLeft): Notification
    {
        $priority = $daysLeft <= 1 ? 'urgent' : ($daysLeft <= 3 ? 'high' : 'normal');

        return Notification::create([
            'user_id' => $user->id,
            'type' => 'deadline_approaching',
            'title' => 'Registration Deadline Approaching',
            'message' => "Only {$daysLeft} day(s) left to register for {$course->title}",
            'data' => [
                'course_id' => $course->id,
                'days_left' => $daysLeft,
            ],
            'priority' => $priority,
            'action_url' => "/courses/{$course->id}",
            'icon' => '⏰',
        ]);
    }

    /**
     * Send notification to all users with a specific role.
     */
    public function sendToRole(string $role, string $type, string $title, string $message, array $data = []): array
    {
        $users = User::where('role', $role)->where('is_active', true)->get();
        $notifications = [];

        foreach ($users as $user) {
            $notifications[] = Notification::create([
                'user_id' => $user->id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => $data,
                'priority' => 'normal',
            ]);
        }

        return $notifications;
    }

    /**
     * Send notification to all registered users of a course.
     */
    public function sendToCourseParticipants(TrainingCourse $course, string $type, string $title, string $message, array $data = []): array
    {
        $registrations = Registration::where('training_course_id', $course->id)
            ->where('status', 'confirmed')
            ->with('user')
            ->get();

        $notifications = [];

        foreach ($registrations as $registration) {
            $notifications[] = Notification::create([
                'user_id' => $registration->user_id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => array_merge($data, [
                    'course_id' => $course->id,
                    'registration_id' => $registration->id,
                ]),
                'priority' => 'normal',
                'action_url' => "/courses/{$course->id}",
            ]);
        }

        return $notifications;
    }

    /**
     * Clean up expired notifications.
     */
    public function cleanupExpiredNotifications(): int
    {
        return Notification::where('expires_at', '<', now())->delete();
    }

    /**
     * Get notification count by priority for a user.
     */
    public function getNotificationCountsByPriority(User $user): array
    {
        return [
            'urgent' => $user->unreadNotifications()->where('priority', 'urgent')->count(),
            'high' => $user->unreadNotifications()->where('priority', 'high')->count(),
            'normal' => $user->unreadNotifications()->where('priority', 'normal')->count(),
            'low' => $user->unreadNotifications()->where('priority', 'low')->count(),
        ];
    }
}
