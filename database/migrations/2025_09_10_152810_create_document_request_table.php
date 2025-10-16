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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('resident')->onDelete('cascade');

            // link to document_types
            $table->foreignId('document_type_id')
                  ->constrained('document_types')
                  ->onDelete('restrict');

            $table->text('purpose')->nullable();
            $table->date('request_date')->useCurrent();

            $table->enum('status', ['pending', 'on process', 'ready for pick-up', 'released'])
                  ->default('pending');
            $table->text('release_name')->nullable();      
            $table->string('qr_token', 100)->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
