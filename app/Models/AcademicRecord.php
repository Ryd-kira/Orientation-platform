<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicRecord extends Model
{
    protected $fillable = [
        'user_id', 'diploma', 'field_of_study', 'institution',
        'grade', 'start_date', 'end_date',
        'disliked_subjects', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'disliked_subjects' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
