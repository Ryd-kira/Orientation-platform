<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id', 'age', 'date_of_birth', 'gender',
        'city', 'region', 'country',
        'budget', 'budget_currency',
        'bio', 'target_job_title', 'target_job_description',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'budget' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
