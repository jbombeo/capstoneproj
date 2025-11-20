<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('youth', function (Blueprint $table) {
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
            $table->string('gender', 10);
            $table->string('contact_number')->nullable();
            $table->json('skills')->nullable(); // ["sports","music"]
            // $table->boolean('is_approved')->default(false);
            // Photo
            $table->text('image')->nullable();

            // Status: pending, approved, rejected
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('youth');
    }
};
