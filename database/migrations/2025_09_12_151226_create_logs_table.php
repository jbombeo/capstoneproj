<?php

// database/migrations/2024_01_01_000011_create_logs_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('logs', function (Blueprint $table) {
            $table->id();
            
            // Foreign key to user
            $table->unsignedBigInteger('users_id');
            $table->foreign('users_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->timestamp('log_date');
            $table->text('action');
            $table->timestamps();

            // Index
            $table->index('users_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('logs');
    }
};
