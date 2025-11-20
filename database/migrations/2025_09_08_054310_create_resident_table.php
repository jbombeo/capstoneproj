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
            $table->foreignId('user_id')->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');

            // Resident information
            $table->string('email')->unique();
            $table->string('last_name', 50);
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('birth_place', 100)->nullable();
            $table->integer('age');

            // Zone
            $table->foreignId('zone_id')
                  ->constrained('zone')
                  ->onDelete('cascade');

            // Household info
            $table->integer('total_household')->default(1);

            // Head / Daughter / Son / Wife etc.
            $table->string('relationto_head_of_family', 50)->nullable();

            // If NOT Head → select their head of family (FK to resident)
            $table->unsignedBigInteger('family_head_id')->nullable();
            $table->foreign('family_head_id')
                  ->references('id')
                  ->on('resident')
                  ->nullOnDelete()
                  ->cascadeOnUpdate();

            // Household number (copied automatically)
            $table->integer('household_no')->nullable();

            // Other details
            $table->string('civil_status', 20)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->string('religion', 50)->nullable();
            $table->string('nationality', 30)->default('Filipino');
            $table->string('gender', 10);
            $table->string('skills', 100)->nullable();
            $table->text('remarks')->nullable();

            // Photo
            $table->text('image')->nullable();

            // Status
            $table->enum('status', ['pending', 'approved', 'rejected'])
                  ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resident');
    }
};
