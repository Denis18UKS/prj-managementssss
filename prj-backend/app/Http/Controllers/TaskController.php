<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function index()
    {
        // Получаем все задачи и добавляем поле 'days_left' к каждой задаче
        $tasks = Task::all()->map(function ($task) {
            $task->days_left = $task->calculateDaysLeft(); // Добавляем вычисленное поле
            return $task;
        });

        return response()->json($tasks, 200);
    }


    // TaskController.php
    public function updateStatus(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        // Проверяем, что новый статус корректен
        $validatedData = $request->validate([
            'status' => 'required|in:Выполняется,Завершена',
        ]);

        // Обновляем только статус
        $task->status = $validatedData['status'];
        $task->save();

        return response()->json([
            'message' => 'Статус задачи обновлен успешно',
            'task' => [
                'start_date' => $task->start_date,
                'end_date' => $task->end_date,
                'days_left' => $task->calculateDaysLeft(), // Добавьте этот метод в модель Task
            ]
        ]);
    }


    protected function validationRules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date|before_or_equal:end_date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'project_id' => 'required'
        ];
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate($this->validationRules());
        $task = Task::create($validatedData);
        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task, 200);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $validatedData = $request->validate($this->validationRules());
        $task->update($validatedData);
        return response()->json($task, 200);
    }

    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }
}
