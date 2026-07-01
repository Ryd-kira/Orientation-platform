<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QiQuestion extends Model
{
    protected $fillable = [
        'subsection_type', 'question_text', 'options',
        'correct_answer', 'difficulty', 'points',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
        ];
    }
}
