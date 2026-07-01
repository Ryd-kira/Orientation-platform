<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketData extends Model
{
    protected $fillable = [
        'job_title', 'sector', 'salary_min', 'salary_max', 'salary_avg',
        'tension_rate', 'region', 'country', 'education_level_required',
        'study_cost_min', 'study_cost_max', 'required_skills', 'related_jobs', 'source',
    ];

    protected function casts(): array
    {
        return [
            'required_skills' => 'array',
            'related_jobs' => 'array',
        ];
    }

    public function scopeByJobTitle($query, string $title)
    {
        return $query->whereRaw('LOWER(job_title) LIKE ?', ['%' . strtolower($title) . '%']);
    }
}
