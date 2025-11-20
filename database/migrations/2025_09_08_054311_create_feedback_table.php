<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();

            // Resident who submitted the feedback
            $table->unsignedBigInteger('resident_id');
            $table->foreign('resident_id')
                ->references('id')
                ->on('resident')
                ->onDelete('cascade');

            // Feedback type
            $table->enum('type', ['feedback', 'suggestion', 'complaint'])
                ->default('feedback');

            // The message from the resident
            $table->text('message');

            // Optional attachment (image, pdf, etc.)
            $table->string('attachment')->nullable();

            // Status so SK/admin can track
            $table->enum('status', ['pending', 'reviewed', 'resolved'])
                ->default('pending');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedback');
    }
};
