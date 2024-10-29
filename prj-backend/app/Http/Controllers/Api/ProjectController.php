<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Http\Resources\ProjectResource;

class ProjectController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return $this->makeResponse(function () {


            return ProjectResource::collection(Project::query()
                ->completed()
                ->where('maintainer_id', auth()->user()->id)
                ->where('executor_id', auth()->user()->id)
                ->get()); //только заврешенные
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
