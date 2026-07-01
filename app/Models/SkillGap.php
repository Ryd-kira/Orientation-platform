<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillGap extends Model
{
    protected $fillable = [
        'user_id', 'career_roadmap_id', 'skill_name',
        'current_level', 'required_level', 'suggested_courses',
    ];

    protected function casts(): array
    {
        return [
            'suggested_courses' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function careerRoadmap()
    {
        return $this->belongsTo(CareerRoadmap::class);
    }
}
