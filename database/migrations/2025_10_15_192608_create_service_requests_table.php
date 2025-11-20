<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();

            $table->foreignId('youth_id')->nullable()->constrained('youth')->nullOnDelete(); // requester
            $table->string('type'); // e.g. Certificate, ID, etc.
            $table->text('details')->nullable();

            $table->enum('status', ['pending', 'processing', 'completed', 'declined'])->default('pending');
            $table->text('remarks')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
