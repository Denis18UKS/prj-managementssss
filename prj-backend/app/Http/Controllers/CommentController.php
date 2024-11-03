<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Метод для получения комментариев по задаче
    public function index($taskId)
    {
        return Comment::where('task_id', $taskId)->get();
    }

    // Метод для создания комментария
    public function store(Request $request, $taskId)
    {
        $request->validate([
            'comment' => 'required|string',
        ]);

        $comment = Comment::create([
            'task_id' => $taskId,
            'comment' => $request->comment,
        ]);

        return response()->json($comment, 201);
    }
}
