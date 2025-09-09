<?php

// database/migrations/2024_01_01_000003_create_tblresident_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('resident', function (Blueprint $table) {
            $table->id();
            $table->string('last_name', 20);
            $table->string('first_name', 20);
            $table->string('middle_name', 20)->nullable();
            $table->date('birth_date');
            $table->string('birth_place', 100);
            $table->integer('age');
            
            // Foreign key to tblzone
            $table->unsignedBigInteger('zone_id');
            $table->foreign('zone_id')
                  ->references('id')
                  ->on('zone')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            
            $table->integer('total_household')->default(1);
            $table->string('differentlyabledperson', 100)->nullable();
            $table->string('relationto_head_of_family', 15)->nullable();
            $table->tinyInteger('marital_status');
            $table->tinyInteger('blood_type');
            $table->tinyInteger('civil_status');
            $table->string('occupation', 100)->nullable();
            $table->decimal('monthly_income', 10, 2)->default(0);
            $table->integer('household_no');
            $table->string('length_of_stay', 15)->nullable();
            $table->tinyInteger('religion');
            $table->string('nationality', 30)->default('Filipino');
            $table->tinyInteger('gender');
            $table->string('skills', 100)->nullable();
            $table->tinyInteger('highest_educational_attainment');
            $table->tinyInteger('house_ownership_status');
            $table->tinyInteger('land_ownership_status');
            $table->tinyInteger('dwelling_type');
            $table->tinyInteger('water_usage');
            $table->tinyInteger('lightning_facilities');
            $table->tinyInteger('sanitary_toilet');
            $table->string('former_address', 200)->nullable();
            $table->text('remarks')->nullable();
            $table->text('image')->nullable();
            $table->string('username', 50)->nullable();
            $table->string('password', 255)->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['zone_id', 'household_no']);
            $table->index('zone_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('resident');
    }
};