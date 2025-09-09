<?php

// database/migrations/2024_01_01_000005_create_tblclearance_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('clearance', function (Blueprint $table) {
            $table->id();
            $table->integer('clearance_no')->unique();
            
            // Foreign key to tblresident
            $table->unsignedBigInteger('resident_id');
            $table->foreign('resident_id')
                  ->references('id')
                  ->on('resident')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->string('findings', 50);
            $table->string('purpose', 50);
            $table->string('or_no', 15);
            $table->decimal('amount', 8, 2);
            $table->date('date_recorded');
            
            // Foreign key to tbluser
            $table->unsignedBigInteger('users_id');
            $table->foreign('users_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->string('status', 15)->default('pending');
            $table->timestamps();

            // Indexes
            $table->index('resident_id');
            $table->index('users_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('clearance');
    }
};