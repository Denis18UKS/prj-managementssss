<?php

namespace App\Http\Resources;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'maintainer' => new UserResource($this->resource->maintainer),
            'executor' => new UserResource($this->resource->executor),
            'days_remaining' => $this->daysRemaining, // Изменено
            'task_counts' => [
                'total' => $this->resource->tasks->count(),
                'created' => $this->resource->tasks()->created()->count(),
                'completed' => $this->resource->tasks()->completed()->count(),
                'in_progress' => $this->resource->tasks()->inProgress()->count(),
            ]
        ]);
    }
}
