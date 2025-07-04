<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'priority',
        'is_read',
        'read_at',
        'action_url',
        'icon',
        'expires_at',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the notification.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include unread notifications.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope a query to only include read notifications.
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Scope a query to only include notifications of a specific type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to only include high priority notifications.
     */
    public function scopeHighPriority($query)
    {
        return $query->whereIn('priority', ['high', 'urgent']);
    }

    /**
     * Scope a query to only include non-expired notifications.
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($query) {
            $query->whereNull('expires_at')
                  ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Mark the notification as read.
     */
    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Mark the notification as unread.
     */
    public function markAsUnread()
    {
        $this->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Get the icon for the notification based on type.
     */
    public function getIconAttribute($value)
    {
        if ($value) {
            return $value;
        }

        // Default icons based on notification type
        return match ($this->type) {
            'course_reminder' => '📚',
            'session_update' => '🔄',
            'registration_confirmed' => '✅',
            'registration_cancelled' => '❌',
            'session_cancelled' => '⚠️',
            'new_course' => '🎓',
            'feedback_request' => '💬',
            'certificate_ready' => '🏆',
            'deadline_approaching' => '⏰',
            'payment_due' => '💳',
            default => '🔔',
        };
    }

    /**
     * Get the priority color for the notification.
     */
    public function getPriorityColor()
    {
        return match ($this->priority) {
            'low' => '#10b981',      // green
            'normal' => '#3b82f6',   // blue
            'high' => '#f59e0b',     // orange
            'urgent' => '#ef4444',   // red
            default => '#6b7280',    // gray
        };
    }
}
