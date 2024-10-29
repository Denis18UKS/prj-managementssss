<?php

namespace Database\Seeders;

use App\Models\ProjectStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $statuses = [
            'created' => 'Создан',
            'in_progress' => 'В процессе',
            'completed' => 'Выполнен'
        ];

        foreach ($statuses as $key => $value) {
            ProjectStatus::factory()->create([
                'name' => $key,
                'description' => $value,
            ]);
        }
    }
}
