<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'subscription_status',
        'subscription_expires_at',
        'phone',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_expires_at' => 'datetime',
        ];
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function academicRecords()
    {
        return $this->hasMany(AcademicRecord::class);
    }

    public function personalityTests()
    {
        return $this->hasMany(PersonalityTest::class);
    }

    public function qiTests()
    {
        return $this->hasMany(QiTest::class);
    }

    public function dreamJobAnalyses()
    {
        return $this->hasMany(DreamJobAnalysis::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }

    public function careerRoadmaps()
    {
        return $this->hasMany(CareerRoadmap::class);
    }

    public function skillGaps()
    {
        return $this->hasMany(SkillGap::class);
    }

    public function isPremium(): bool
    {
        return $this->subscription_status === 'premium'
            && $this->subscription_expires_at
            && $this->subscription_expires_at->isFuture();
    }
}
