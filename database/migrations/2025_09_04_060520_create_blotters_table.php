<?php

// database/migrations/2024_01_01_000001_create_blotters_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('blotters', function (Blueprint $table) {
            $table->id();

            // Complainant info
            $table->string('complainant');
            $table->string('complainant_address')->nullable();
            $table->integer('complainant_age')->nullable();
            $table->string('complainant_contact')->nullable();

            // Complainee info
            $table->string('complainee');
            $table->string('complainee_address')->nullable();
            $table->integer('complainee_age')->nullable();
            $table->string('complainee_contact')->nullable();

            // Complaint details
            $table->text('complaint');
            $table->enum('status', ['unsettled', 'settled', 'scheduled'])->default('unsettled');
            $table->string('action')->nullable();
            $table->string('incidence')->nullable();

            // Dates
            $table->dateTime('incident_datetime')->nullable(); // Exact date & time of incident
            $table->year('year_recorded')->nullable();         // For reports/filters

            // Barangay handling
            $table->string('handled_by')->nullable(); // Barangay official/officer in charge

            $table->timestamps();
            $table->softDeletes(); // Allows restore of deleted blotters
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blotters');
    }
};
