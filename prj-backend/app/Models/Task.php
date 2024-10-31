<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
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
}
