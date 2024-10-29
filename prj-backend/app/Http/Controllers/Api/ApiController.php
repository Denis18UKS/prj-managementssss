<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Throwable;

abstract class ApiController extends Controller
{
    /**
     * Создает ответ с данными.
     *
     * @param callable $action Действие, результат выполнения которого нужно вернуть в положительном ответе.
     *
     * @return JsonResponse
     */
    public function makeResponse(callable $action): JsonResponse
    {
        try {
            return $this->sendSuccess($action());
        } catch (Throwable $e) {
            return $this->sendError($e->getMessage());
        }
    }

    /**
     * Возвращает положительный ответ с данными.
     *
     * @param mixed $result Данные для ответа.
     *
     * @return JsonResponse
     */
    public function sendSuccess(mixed $result): JsonResponse
    {
        return response()->json([
            'status' => true,
            'data'   => $result,
        ]);
    }

    /**
     * Возвращает ответ с ошибкой.
     *
     * @param string $error Описание ошибки.
     * @param int    $code  Код ошибки.
     *
     * @return JsonResponse
     */
    public function sendError(string $error, int $code = 500): JsonResponse
    {
        return response()->json([
            'status' => false,
            'data'   => [
                'error' => [
                    'code'    => $code,
                    'message' => $error,
                ],
            ],
        ]);
    }
}
