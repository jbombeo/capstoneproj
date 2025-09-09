<?php

// database/migrations/2024_01_01_000010_create_tblofficial_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('official', function (Blueprint $table) {
            $table->id();
            $table->string('position', 50);
            $table->string('complete_name', 50);
            $table->string('contact', 20);
            $table->string('address', 100);
            $table->date('term_start');
            $table->date('term_end');
            $table->string('status', 20)->default('active');
            
            // Foreign key to tbluser
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
        Schema::dropIfExists('official');
    }
};