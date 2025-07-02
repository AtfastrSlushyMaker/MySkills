<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrainingCourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'duration_hours',
        'max_participants',
        'category_id',
        'created_by',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'duration_hours' => 'integer',
            'max_participants' => 'integer',
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function trainingSessions()
    {
        return $this->hasMany(TrainingSession::class);
    }

    // Helper methods
    public function getUpcomingSessionsAttribute()
    {
        return $this->trainingSessions()
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('start_time');
    }

    public function getTotalRegistrationsAttribute(): int
    {
        return $this->trainingSessions()
            ->withCount(['registrations' => function($query) {
                $query->where('status', 'confirmed');
            }])
            ->get()
            ->sum('registrations_count');
    }
}
