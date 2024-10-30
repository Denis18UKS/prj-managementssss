<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ProjectController extends Controller
{
    public function index()
    {
        Log::info('Fetching all projects');
        $projects = Project::with(['maintainer', 'executor'])->get();
        Log::info('Projects fetched successfully', ['count' => $projects->count()]);
        return $projects;
    }

    public function show($id)
    {
        Log::info('Fetching project with ID: ' . $id);
        $project = Project::with(['projectStatus', 'maintainer', 'executor'])->findOrFail($id);
        Log::info('Project fetched successfully', ['project' => $project]);
        return $project;
    }

    public function store(Request $request)
    {
        Log::info('Creating a new project', ['request' => $request->all()]);

        $request->validate([
            'maintainer_id' => 'required|exists:users,id',
            'executor_id' => 'required|exists:users,id',
            'title' => 'required|string|unique:projects,title',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'priority' => 'required|in:low,medium,high' // Проверка приоритета
        ]);

        $data = $request->all();

        // Расчет оставшихся дней
        $startDate = Carbon::parse($data['start_date']);
        $endDate = Carbon::parse($data['end_date']);
        $data['remaining_days'] = $endDate->diffInDays(Carbon::now());

        $project = Project::create($data);
        Log::info('Project created successfully', ['project' => $project]);

        return response()->json($project, 201);
    }



    public function update(Request $request, $id)
    {
        Log::info('Updating project with ID: ' . $id, ['request' => $request->all()]);

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

        $data = $request->all();

        // Обновление оставшихся дней, если даты изменены
        if ($request->has(['start_date', 'end_date'])) {
            $startDate = Carbon::parse($data['start_date'] ?? $project->start_date);
            $endDate = Carbon::parse($data['end_date'] ?? $project->end_date);
            $data['remaining_days'] = $endDate->diffInDays($startDate);
        }

        $project->update($data);
        Log::info('Project updated successfully', ['project' => $project]);

        return $project;
    }

    public function destroy($id)
    {
        Log::info('Deleting project with ID: ' . $id);

        $project = Project::findOrFail($id);
        $project->delete();

        Log::info('Project deleted successfully', ['project_id' => $id]);
        return response()->noContent();
    }
}