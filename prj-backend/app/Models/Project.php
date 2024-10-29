<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'maintainer_id',
        'executor_id',
        'title',
        'description',
        'start_date',
        'end_date',
    ];


    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'status' => 'string',
    ];


    public function maintainer()
    {
        return $this->belongsTo(User::class, 'maintainer_id');
    }

    public function executor()
    {
        return $this->belongsTo(User::class, 'executor_id');
    }

    public function getDaysRemainingAttribute(): int
    {
        if ($this->status === 'completed') {
            return 0;
        }

        return Carbon::now()->diffInDays($this->end_date, false);
    }

    public function scopeCompleted(Builder $builder)
    {
        return $builder->where('status', 'completed');
    }
}
