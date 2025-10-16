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
                $table->string('activity');
                $table->text('description');
                
                
                $table->timestamps();

            });
        }

        public function down()
        {
            Schema::dropIfExists('activity');
        }
    };

