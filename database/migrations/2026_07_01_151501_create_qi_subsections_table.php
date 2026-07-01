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
        Schema::create('qi_subsections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('qi_test_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->integer('score')->default(0);
            $table->integer('max_score')->default(0);
            $table->integer('time_spent_seconds')->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qi_subsections');
    }
};
