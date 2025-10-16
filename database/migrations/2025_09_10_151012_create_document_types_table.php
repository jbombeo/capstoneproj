<?php

// database/migrations/2025_01_01_000002_create_document_types_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique(); // e.g. Barangay Clearance, Certificate of Indigency
            $table->decimal('amount', 8, 2)->default(0); // default fee
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_types');
    }
};
