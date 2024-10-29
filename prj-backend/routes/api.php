<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LogOutController;
use App\Http\Controllers\Api\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserRoleController;

Route::name('api')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('register', [RegisterController::class, 'register']);
    });
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::get('te', function () {
    return 123;
});

Route::get('/assign-admin-role', [UserRoleController::class, 'assignAdminRole']);
