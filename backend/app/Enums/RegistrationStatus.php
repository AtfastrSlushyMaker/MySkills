<?php

namespace App\Enums;

enum RegistrationStatus: string
{
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';

    /**
     * Get all status values as array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get status display name
     */
    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending Approval',
            self::CONFIRMED => 'Confirmed',
            self::CANCELLED => 'Cancelled',
        };
    }

    /**
     * Get status color for UI
     */
    public function color(): string
    {
        return match($this) {
            self::PENDING => 'yellow',
            self::CONFIRMED => 'green',
            self::CANCELLED => 'red',
        };
    }

    /**
     * Check if registration can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return match($this) {
            self::PENDING, self::CONFIRMED => true,
            self::CANCELLED => false,
        };
    }

    /**
     * Check if registration allows attendance
     */
    public function allowsAttendance(): bool
    {
        return $this === self::CONFIRMED;
    }
}
