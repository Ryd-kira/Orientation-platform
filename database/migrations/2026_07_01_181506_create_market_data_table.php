<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('market_data', function (Blueprint $table) {
            $table->id();
            $table->string('job_title');
            $table->string('sector')->nullable();
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->decimal('salary_avg', 10, 2)->nullable();
            $table->decimal('tension_rate', 5, 2)->nullable();
            $table->string('region')->nullable();
            $table->string('country')->default('France');
            $table->string('education_level_required')->nullable();
            $table->decimal('study_cost_min', 10, 2)->nullable();
            $table->decimal('study_cost_max', 10, 2)->nullable();
            $table->json('required_skills')->nullable();
            $table->json('related_jobs')->nullable();
            $table->string('source')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_data');
    }
};
