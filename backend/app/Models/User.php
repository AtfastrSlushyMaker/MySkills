<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'role',
        'is_active',
        'status', // Add status to fillable
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'role' => UserRole::class,
            'status' => UserStatus::class,
        ];
    }

    // Relationships
    public function trainingSessions()
    {
        return $this->hasMany(TrainingSession::class, 'trainer_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    public function createdCourses()
    {
        return $this->hasMany(TrainingCourse::class, 'created_by');
    }

    // Role check methods
    public function isAdmin(): bool
    {
        return $this->role === UserRole::ADMIN;
    }

    public function isCoordinator(): bool
    {
        return $this->role === UserRole::COORDINATOR;
    }

    public function isTrainer(): bool
    {
        return $this->role === UserRole::TRAINER;
    }

    public function isTrainee(): bool
    {
        return $this->role === UserRole::TRAINEE;
    }

    // Additional role-based methods
    public function canCreateCourses(): bool
    {
        return $this->role->canCreateCourses();
    }

    public function canManageUsers(): bool
    {
        return $this->role->canManageUsers();
    }

    public function canDeliverTraining(): bool
    {
        return $this->role->canDeliverTraining();
    }
}
