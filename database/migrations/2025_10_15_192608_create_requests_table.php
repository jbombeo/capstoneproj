<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('youth_id')->constrained('youth')->onDelete('cascade');
            $table->foreignId('sk_official_id')->nullable()->constrained('sk_officials')->onDelete('set null');
            $table->enum('category', ['complaint', 'suggestion', 'request']);
            $table->text('description');
            $table->enum('status', ['pending', 'in_progress', 'resolved', 'rejected'])->default('pending');
            $table->timestamp('date_submitted')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
