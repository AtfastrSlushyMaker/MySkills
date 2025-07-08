<?php

namespace App\Enums;

enum TrainingSessionStatus: string
{
    case CREATED = 'created';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';
    case ARCHIVED = 'archived';
}
