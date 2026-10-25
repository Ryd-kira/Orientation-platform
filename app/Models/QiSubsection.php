<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QiSubsection extends Model
{
    protected $fillable = [
        'qi_test_id', 'type', 'score', 'max_score',
        'time_spent_seconds', 'status', 'question_ids', 'started_at',
    ];

    protected function casts(): array
    {
        return [
            'question_ids' => 'array',
            'started_at' => 'datetime',
        ];
    }

    public function qiTest()
    {
        return $this->belongsTo(QiTest::class);
    }
}
