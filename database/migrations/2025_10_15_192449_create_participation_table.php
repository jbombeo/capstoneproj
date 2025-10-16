<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('participation', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('youth_id')->constrained('youth')->onDelete('cascade');
            $table->enum('attendance_status', ['registered', 'attended', 'absent'])->default('registered');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('participation');
    }
};
