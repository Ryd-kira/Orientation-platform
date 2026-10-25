<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('qi_subsections', function (Blueprint $table) {
            $table->json('question_ids')->nullable();
            $table->timestamp('started_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('qi_subsections', function (Blueprint $table) {
            $table->dropColumn(['question_ids', 'started_at']);
        });
    }
};
