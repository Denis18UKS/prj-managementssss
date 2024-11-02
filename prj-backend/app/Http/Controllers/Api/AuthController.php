<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Api\UserLoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AuthController extends ApiController
{
    public function login(UserLoginRequest $loginRequest): JsonResponse
    {
        // Получаем данные для аутентификации из запроса
        $credentials = $loginRequest->only(['email', 'password']);
        Log::info('Попытка входа с данными:', $credentials);

        // Пытаемся выполнить аутентификацию
        if (Auth::attempt($credentials, true)) {
            $user = Auth::user(); // Получаем текущего аутентифицированного пользователя
            Log::info('Успешный вход для пользователя:', ['id' => $user->id]);

            // Проверка роли пользователя
            $role = $user->roles->first(); // Получаем первую роль пользователя

            // Определяем URL для редиректа на основе роли
            $redirectUrl = url('/projects-and-tasks'); // URL по умолчанию
            if ($role) {
                switch ($role->name) {
                    case 'Admin':
                        $redirectUrl = url('http://prj-frontend/admin/users.php');
                        break;
                    case 'manager':
                        $redirectUrl = url('http://prj-frontend/manager/projects-tasks.php'); // URL для роли manager
                        break;
                        // Вы можете добавить другие роли, если это необходимо
                    case 'user':
                        $redirectUrl = url('http://prj-frontend/user/projects-tasks.php');
                        break;
                    default:
                        $redirectUrl = url('http://prj-frontend/projects-and-tasks'); // По умолчанию для остальных ролей
                        break;
                }
            }

            // Возвращаем успешный ответ с информацией о пользователе и URL для редиректа
            return response()->json([
                'message' => 'Вход выполнен успешно.',
                'user' => new UserResource($user),
                'redirect_url' => $redirectUrl
            ], 200);
        }

        // В случае неудачной попытки возвращаем ошибку
        return $this->sendError('Неверное имя пользователя или пароль.', Response::HTTP_UNAUTHORIZED);
    }

    // Логика для выхода
    public function logout(): JsonResponse
    {
        Log::info('Пользователь вышел из системы:', ['id' => Auth::id()]);

        // Завершение сессии пользователя
        Auth::logout();

        // Возвращаем успешный ответ
        return response()->json([
            'message' => 'Вы успешно вышли из системы.'
        ], 200);
    }
}
