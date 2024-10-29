<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('roles')->select('id', 'name', 'email')->get();
        return response()->json($users);
    }

    public function managers(): JsonResponse
    {
        $users = User::role('manager')->select('id', 'name')->get();
        return response()->json($users);
    }

    public function executors(): JsonResponse
    {
        $users = User::role('executors')->select('id', 'name')->get();
        return response()->json($users);
    }

    public function show($id): JsonResponse
    {
        $user = User::with('roles')->find($id);
        if (!$user) {
            return response()->json(['message' => 'Пользователь не найден.'], Response::HTTP_NOT_FOUND);
        }
        return response()->json($user);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Пользователь не найден.'], Response::HTTP_NOT_FOUND);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|exists:roles,name',
        ]);

        // Обновление данных пользователя
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Поиск или создание роли с guard `web`
        $role = Role::firstOrCreate(['name' => $request->input('role'), 'guard_name' => 'web']);

        // Назначение роли пользователю
        $user->syncRoles([$role]);

        return response()->json(['message' => 'Данные пользователя обновлены.']);
    }

    public function destroy($id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Пользователь не найден.'], Response::HTTP_NOT_FOUND);
        }

        $user->delete();

        return response()->json(['message' => 'Пользователь успешно удален.']);
    }
}
