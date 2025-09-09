<?php

// database/migrations/2024_01_01_000004_create_tblhousehold_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('household', function (Blueprint $table) {
            $table->id();
            $table->integer('household_no');
            
            // Foreign key to tblzone
            $table->unsignedBigInteger('zone_id');
            $table->foreign('zone_id')
                  ->references('id')
                  ->on('zone')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->integer('household_member')->default(1);
            
            // Foreign key to tblresident (head of family)
            $table->unsignedBigInteger('head_of_family');
            $table->foreign('head_of_family')
                  ->references('id')
                  ->on('resident')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->timestamps();

            // Indexes
            $table->index(['zone_id', 'head_of_family']);
            $table->index('zone_id');
            $table->index('head_of_family');
        });
    }

    public function down()
    {
        Schema::dropIfExists('household');
    }
};