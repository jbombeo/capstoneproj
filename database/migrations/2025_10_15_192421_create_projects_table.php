    <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up(): void
        {
            Schema::create('projects', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();

                $table->enum('status', ['planned', 'ongoing', 'completed', 'cancelled'])->default('planned');
                $table->decimal('budget', 12, 2)->nullable();

                $table->date('start_date')->nullable();
                $table->date('end_date')->nullable();

                $table->string('image_path')->nullable(); // upload
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete(); // SK user

                $table->timestamps();
                $table->softDeletes();
            });
        }

        public function down(): void
        {
            Schema::dropIfExists('projects');
        }
    };
