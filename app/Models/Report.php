<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'user_id', 'type', 'file_path',
        'premium_only', 'downloads_count', 'generated_at',
    ];

    protected function casts(): array
    {
        return [
            'premium_only' => 'boolean',
            'generated_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
