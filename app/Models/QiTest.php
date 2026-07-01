<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QiTest extends Model
{
    protected $fillable = [
        'user_id', 'status', 'total_score',
        'standard_deviation', 'percentile', 'iq_score',
        'started_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subsections()
    {
        return $this->hasMany(QiSubsection::class);
    }

    public function answers()
    {
        return $this->hasMany(QiAnswer::class);
    }
}
