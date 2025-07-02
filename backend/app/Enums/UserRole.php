<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case COORDINATOR = 'coordinator';
    case TRAINER = 'trainer';
    case TRAINEE = 'trainee';

    /**
     * Get all role values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get role display name
     */
    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Administrator',
            self::COORDINATOR => 'Coordinator',
            self::TRAINER => 'Trainer',
            self::TRAINEE => 'Trainee',
        };
    }

    /**
     * Check if role can create courses
     */
    public function canCreateCourses(): bool
    {
        return match($this) {
            self::ADMIN, self::COORDINATOR => true,
            default => false,
        };
    }

    /**
     * Check if role can manage users
     */
    public function canManageUsers(): bool
    {
        return $this === self::ADMIN;
    }

    /**
     * Check if role can deliver training
     */
    public function canDeliverTraining(): bool
    {
        return match($this) {
            self::TRAINER, self::ADMIN => true,
            default => false,
        };
    }
}
