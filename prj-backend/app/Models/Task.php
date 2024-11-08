<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'priority',
        'start_date',
        'end_date',
        'project_id'
    ];

    // Task.php
    public function calculateDaysLeft()
    {
        if ($this->end_date) {
            $today = now();
            $endDate = \Carbon\Carbon::parse($this->end_date);
            return $endDate->greaterThan($today) ? $endDate->diffInDays($today) : 0;
        }
        return null; // если дата окончания не указана
    }


    public function project()
    {
        return $this->belongsTo(Project::class);
    }


    public function scopeCreated(Builder $builder)
    {
        return $builder->where('status', 'Назначена');
    }


    public function scopeCompleted(Builder $builder)
    {
        return $builder->where('status', 'Завершена');
    }

    public function scopeInProgress(Builder $builder)
    {
        return $builder->where('status', 'Выполняется');
    }
}
