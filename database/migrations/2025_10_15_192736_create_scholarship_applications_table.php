<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholarship_applications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('scholarship_id')
                ->constrained('scholarships')
                ->onDelete('cascade');

            $table->foreignId('youth_id')
                ->constrained('youth')
                ->onDelete('cascade');

            $table->enum('status', [
                'pending',
                'for interview',
                'for requirement',
                'granted',
            ])->default('pending');

            $table->date('interview_date')->nullable();
            $table->time('interview_time')->nullable();

            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scholarship_applications');
    }
};
