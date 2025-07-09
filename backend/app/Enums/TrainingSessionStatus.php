<?php

namespace App\Enums;

enum TrainingSessionStatus: string
{
    case ACTIVE = 'active';
    case ARCHIVED = 'archived';
}
