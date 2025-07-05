<?php

namespace App\Models;

use App\Enums\RegistrationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'training_session_id',
        'registration_date',
        'status'
    ];

    protected function casts(): array
    {
        return [
            'registration_date' => 'datetime',
            'status' => RegistrationStatus::class,
        ];
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function trainingSession()
    {
        return $this->belongsTo(TrainingSession::class);
    }

    public function attendance()
    {
        return $this->hasOne(Attendance::class);
    }

    public function feedback()
    {
        return $this->hasOne(Feedback::class);
    }

    public function sessionCompletion()
    {
        return $this->hasOne(SessionCompletion::class);
    }

    // Helper methods
    public function canBeCancelled(): bool
    {
        return $this->status->canBeCancelled() && $this->trainingSession->isScheduled();
    }

    public function isConfirmed(): bool
    {
        return $this->status === RegistrationStatus::CONFIRMED;
    }

    public function isPending(): bool
    {
        return $this->status === RegistrationStatus::PENDING;
    }

    public function isCancelled(): bool
    {
        return $this->status === RegistrationStatus::CANCELLED;
    }
}
