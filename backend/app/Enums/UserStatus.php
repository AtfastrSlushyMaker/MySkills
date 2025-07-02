<?php

namespace App\Enums;

enum UserStatus: string
{
    case ACTIVE = 'active';
    case BANNED = 'banned';
    case INACTIVE = 'inactive';
    // Add more statuses as needed

    public function color(): string
    {
        return match($this) {
            self::ACTIVE => '#22c55e',    // green
            self::BANNED => '#ef4444',    // red
            self::INACTIVE => '#a3a3a3',  // gray
            default => '#000000',         // black as fallback
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
