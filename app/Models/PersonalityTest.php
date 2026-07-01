<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalityTest extends Model
{
    protected $fillable = [
        'user_id', 'status', 'overall_score',
        'summary', 'started_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'summary' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function traitResults()
    {
        return $this->hasMany(PersonalityTraitResult::class);
    }
}
