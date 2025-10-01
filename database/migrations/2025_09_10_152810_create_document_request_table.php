<?php

// database/migrations/2025_01_01_000000_create_document_requests_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('resident')->onDelete('cascade');
            $table->string('document_type', 50); // e.g. Barangay Certificate
            $table->text('purpose')->nullable();
            $table->date('request_date')->useCurrent();

            // ✅ Add status column with default value 'pending'
            $table->enum('status', ['pending', 'on process', 'ready for pick-up', 'released'])
                  ->default('pending');
                  
            $table->string('qr_token', 100)->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};

