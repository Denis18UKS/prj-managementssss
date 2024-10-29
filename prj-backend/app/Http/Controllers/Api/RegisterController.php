<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\UserRegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class RegisterController extends ApiController
{

    // разберись с hasrole, сделаю правильную авторизацию, ограничение доступа по ролям к странице регистрации
    // и сделай CRUD за админа

    public function register(UserRegisterRequest $request): JsonResponse
    {
        // /** @var User $user */
        // $user = Auth::user();
        // if (!Auth::check() || $user || !$user->hasRole('admin')) {
        //     return $this->sendError('У вас нет прав для регистрации новых пользователей.', 403);
        // }


        return $this->makeResponse(function () use ($request) {
            try {

                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);
                $user->assignRole('user');

                return response()->json([
                    'message' => 'Регистрация прошла успешно.',
                    'user' => new UserResource($user),
                ], 201);
            } catch (\Exception $e) {
                Log::error('Ошибка при регистрации: ' . $e->getMessage() . ' | Stack trace: ' . $e->getTraceAsString());
                return $this->sendError('Ошибка при регистрации пользователя: ' . $e->getMessage(), 500);
            }
        });
    }
}
