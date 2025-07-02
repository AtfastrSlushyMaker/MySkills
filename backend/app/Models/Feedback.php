<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_id',
        'rating',
        'comment'
        
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
        ];
    }

    // Relationships
    public function registration()
    {
        return $this->belongsTo(Registration::class);
    }

    // Helper methods
    public function getRatingStarsAttribute(): string
    {
        return str_repeat('★', $this->rating) . str_repeat('☆', 5 - $this->rating);
    }

    public function isPositiveFeedback(): bool
    {
        return $this->rating >= 4;
    }
}
