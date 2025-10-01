<?php

// database/migrations/2024_01_01_000008_create_activity_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('activity', function (Blueprint $table) {
            $table->id();
            $table->date('dateofactivity');
            $table->text('activity');
            $table->text('description');
            
            // Foreign key to luser
            $table->unsignedBigInteger('users_id');
            $table->foreign('users_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->timestamps();

            // Index
            $table->index('users_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('activity');
    }
};

