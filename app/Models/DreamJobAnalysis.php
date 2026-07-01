<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DreamJobAnalysis extends Model
{
    protected $fillable = [
        'user_id', 'job_title', 'job_description',
        'nlp_analysis', 'compatibility_score',
    ];

    protected function casts(): array
    {
        return [
            'nlp_analysis' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
