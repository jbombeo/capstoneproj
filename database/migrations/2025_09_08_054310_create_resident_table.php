<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resident', function (Blueprint $table) {
            $table->id();

            // Link to users table, nullable until approved
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');

            // Resident-provided email
            $table->string('email')->unique();
            $table->string('last_name', 50);
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('birth_place', 100)->nullable();
            $table->integer('age');

            // Zone
            $table->foreignId('zone_id')->constrained('zone')->onDelete('cascade');

            // Household / family info
            $table->integer('total_household')->default(1);
            $table->string('relationto_head_of_family', 50)->nullable();

            // Demographics
            $table->string('civil_status', 20)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->integer('household_no')->nullable();
            $table->string('religion', 50)->nullable();
            $table->string('nationality', 30)->default('Filipino');
            $table->string('gender', 10);

            // Education / skills / remarks
            $table->string('skills', 100)->nullable();
            $table->text('remarks')->nullable();

            // Photo
            $table->text('image')->nullable();

            // Status: pending, approved, rejected
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident');
    }
};
