<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some users (assuming they exist)
        $users = User::limit(5)->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $notificationTypes = [
            [
                'type' => 'course_reminder',
                'title' => 'Training Session Tomorrow',
                'message' => 'Don\'t forget about your React Development session tomorrow at 09:00',
                'priority' => 'normal',
                'icon' => '📚',
                'action_url' => '/courses/1/sessions/1',
            ],
            [
                'type' => 'registration_confirmed',
                'title' => 'Registration Confirmed',
                'message' => 'You have successfully registered for Advanced JavaScript',
                'priority' => 'normal',
                'icon' => '✅',
                'action_url' => '/courses/2',
            ],
            [
                'type' => 'session_update',
                'title' => 'Session Update',
                'message' => 'The location for Python Basics session has been changed to Room 301',
                'priority' => 'high',
                'icon' => '🔄',
                'action_url' => '/courses/3/sessions/2',
            ],
            [
                'type' => 'new_course',
                'title' => 'New Course Available',
                'message' => 'A new course "Machine Learning Fundamentals" is now available for registration',
                'priority' => 'normal',
                'icon' => '🎓',
                'action_url' => '/courses/4',
            ],
            [
                'type' => 'feedback_request',
                'title' => 'Feedback Requested',
                'message' => 'Please provide feedback for the Database Design session',
                'priority' => 'normal',
                'icon' => '💬',
                'action_url' => '/feedback/session/3',
                'expires_at' => now()->addDays(7),
            ],
            [
                'type' => 'deadline_approaching',
                'title' => 'Registration Deadline Approaching',
                'message' => 'Only 2 days left to register for Cloud Computing Essentials',
                'priority' => 'urgent',
                'icon' => '⏰',
                'action_url' => '/courses/5',
            ],
            [
                'type' => 'certificate_ready',
                'title' => 'Certificate Ready',
                'message' => 'Your certificate for Web Development Fundamentals is ready for download',
                'priority' => 'normal',
                'icon' => '🏆',
                'action_url' => '/certificates/1',
            ],
            [
                'type' => 'session_cancelled',
                'title' => 'Session Cancelled',
                'message' => 'The Data Science session scheduled for tomorrow has been cancelled',
                'priority' => 'high',
                'icon' => '❌',
                'action_url' => '/courses/6/sessions/4',
            ],
        ];

        foreach ($users as $user) {
            // Create 3-5 random notifications per user
            $numNotifications = rand(3, 5);
            $selectedNotifications = collect($notificationTypes)->random($numNotifications);

            foreach ($selectedNotifications as $notificationData) {
                Notification::create([
                    'user_id' => $user->id,
                    'type' => $notificationData['type'],
                    'title' => $notificationData['title'],
                    'message' => $notificationData['message'],
                    'priority' => $notificationData['priority'],
                    'icon' => $notificationData['icon'],
                    'action_url' => $notificationData['action_url'],
                    'expires_at' => $notificationData['expires_at'] ?? null,
                    'is_read' => rand(0, 3) > 0, // 75% chance of being unread
                    'read_at' => rand(0, 3) > 0 ? null : now()->subHours(rand(1, 48)),
                    'data' => [
                        'course_id' => rand(1, 10),
                        'session_id' => rand(1, 20),
                    ],
                    'created_at' => now()->subHours(rand(1, 168)), // Random time in last week
                ]);
            }
        }

        $this->command->info('Sample notifications created successfully!');
    }
}
