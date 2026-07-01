<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QiAnswer extends Model
{
    protected $fillable = [
        'qi_test_id', 'qi_question_id', 'selected_answer',
        'is_correct', 'time_spent_seconds',
    ];

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    public function qiTest()
    {
        return $this->belongsTo(QiTest::class);
    }

    public function question()
    {
        return $this->belongsTo(QiQuestion::class, 'qi_question_id');
    }
}
