<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'comment', // добавляем поле user_id в список доступных для массового заполнения
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
