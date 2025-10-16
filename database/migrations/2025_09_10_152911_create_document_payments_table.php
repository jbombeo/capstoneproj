<?php

// database/migrations/2025_01_01_000001_create_document_payments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_request_id')->constrained('document_requests')->onDelete('cascade');
            $table->string('payment_method', 20); // Cash / GCash
            $table->decimal('amount', 8, 2)->default(0);
            $table->string('reference_number', 30)->nullable(); // only required for GCash
            $table->string('or_number', 30)->unique(); // ✅ unique OR number
            $table->dateTime('paid_at')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_payments');
    }
};
