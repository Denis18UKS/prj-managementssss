<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::with(['projectStatus', 'maintainer', 'executor'])->get();
    }

    public function show($id)
    {
        return Project::with(['projectStatus', 'maintainer', 'executor'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'project_status_id' => 'required|exists:project_statuses,id',
            'maintainer_id' => 'required|exists:users,id',
            'executor_id' => 'required|exists:users,id',
            'title' => 'required|string|unique:projects,title',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        return Project::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        $request->validate([
            'project_status_id' => 'exists:project_statuses,id',
            'maintainer_id' => 'exists:users,id',
            'executor_id' => 'exists:users,id',
            'title' => 'string|unique:projects,title,' . $project->id,
            'description' => 'string',
            'start_date' => 'date',
            'end_date' => 'date|after:start_date',
        ]);

        $project->update($request->all());

        return $project;
    }

    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->noContent();
    }
}
