<?php

namespace App\Http\Resources;

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
            'days_remaining' => new UserResource($this->resource->daysRemaining),
        ]);
    }
}
