    <?php

    // database/migrations/2024_01_01_000009_create_activityphoto_table.php
    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up()
        {
            Schema::create('activity_photos', function (Blueprint $table) {
                $table->id();
                
                // Foreign key to tblactivity
                $table->unsignedBigInteger('activity_id');
                $table->foreign('activity_id')
                    ->references('id')
                    ->on('activity')
                    ->onDelete('cascade')
                    ->onUpdate('cascade');
                
                $table->string('filename');
                $table->timestamps();

                // Index
                $table->index('activity_id');
            });
        }

        public function down()
        {
            Schema::dropIfExists('activity_photos');
        }
    };

