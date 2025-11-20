<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('household', function (Blueprint $table) {
            $table->id();

            // Household number (auto-generated in controller)
            $table->integer('household_no')->unique();

            // Zone ID
            $table->foreignId('zone_id')
                  ->constrained('zone')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            // Number of residents in the household
            $table->integer('household_member')->default(1);

            // Head of family (must be a resident)
            $table->foreignId('head_of_family')
                  ->constrained('resident')
                  ->cascadeOnDelete()
                  ->cascadeOnUpdate();

            $table->timestamps();

            // Indexes
            $table->index(['zone_id', 'head_of_family']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('household');
    }
};
