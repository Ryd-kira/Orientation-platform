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
        Schema::create('personality_trait_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('personality_test_id')->constrained()->cascadeOnDelete();
            $table->string('trait_name');
            $table->integer('score');
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personality_trait_results');
    }
};
