<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $taskId)
    {
        $comment = Comment::create([
            'task_id' => $taskId,
            'comment' => $request->input('comment'),
        ]);

        return response()->json(['message' => 'Комментарий добавлен!'])
            ->header('Access-Control-Allow-Origin', '*');
    }


    public function index($taskId)
    {
        $comments = Comment::where('task_id', $taskId)->get();
        return response()->json($comments)
            ->header('Access-Control-Allow-Origin', '*');
    }
}
