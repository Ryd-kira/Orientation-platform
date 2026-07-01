<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerRoadmap extends Model
{
    protected $fillable = [
        'user_id', 'target_job', 'roadmap_data', 'generated_at',
    ];

    protected function casts(): array
    {
        return [
            'roadmap_data' => 'array',
            'generated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skillGaps()
    {
        return $this->hasMany(SkillGap::class);
    }
}
