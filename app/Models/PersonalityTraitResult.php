<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalityTraitResult extends Model
{
    protected $fillable = [
        'personality_test_id', 'trait_name', 'score', 'details',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
        ];
    }

    public function personalityTest()
    {
        return $this->belongsTo(PersonalityTest::class);
    }
}
