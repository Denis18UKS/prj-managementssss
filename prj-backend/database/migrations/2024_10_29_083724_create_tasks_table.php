<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Исполнитель задачи
            $table->enum('priority', ['Низкий', 'Средний', 'Высокий']);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['Назначена', 'Выполняется', 'Завершена']);
            $table->integer('days_left')->default(0); // Подсчёт остатка дней
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['assignee_id']);
            $table->dropColumn('assignee_id');
        });

        Schema::dropIfExists('tasks');
    }
};
