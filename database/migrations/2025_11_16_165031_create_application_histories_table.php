<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('application_histories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('scholarship_application_id')
                ->constrained('scholarship_applications')
                ->onDelete('cascade');

            $table->string('status');     // pending, for interview, etc.
            $table->text('remarks')->nullable();
            $table->foreignId('user_id')->nullable()->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_histories');
    }
};
