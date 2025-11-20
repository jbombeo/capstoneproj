<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sk_officials', function (Blueprint $table) {
            $table->id();

            // SK official position (Chairperson, Kagawad, Secretary, etc.)
            $table->string('position', 50);

            // SK official's complete name
            $table->string('complete_name', 100);

            // Contact and address
            $table->string('contact', 20)->nullable();
            $table->string('address', 150)->nullable();

            // Term of service
            $table->date('term_start')->nullable();
            $table->date('term_end')->nullable();

            // Status (active/inactive)
            $table->string('status', 20)->default('active');

            // Optional image
            $table->string('image')->nullable();

            // Foreign key to users table (SK user account)
            $table->unsignedBigInteger('users_id');
            $table->foreign('users_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');

            $table->timestamps();

            // Index for faster queries
            $table->index('users_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sk_officials');
    }
};
