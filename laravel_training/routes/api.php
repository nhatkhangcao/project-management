<?php

use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\User\LoginController;
use App\Http\Controllers\User\UserController;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
  // User Management
  Route::post('/logout', [LoginController::class, 'logout']);
  Route::get('/userlist', [UserController::class, 'index']);
  Route::get('/search-user', [UserController::class, 'searchUser']);
  Route::get('/get-email', [UserController::class, 'getUserByEmail']);
  Route::post('/add-user', [UserController::class, 'addUser']);
  Route::post('/edit-user/{id}', [UserController::class, 'editUser']);
  Route::post('/destroy-user/{id}', [UserController::class, 'destroyUser']);
  Route::post('/block-user/{id}', [UserController::class, 'blockUser']);

  // Product Management
  Route::get('/product', [ProductController::class, 'index']);
  Route::get('/search-product', [ProductController::class, 'searchProduct']);
  Route::post('/add-product', [ProductController::class, 'addProduct']);
  Route::post('/destroy-product/{id}', [ProductController::class, 'destroyProduct']);
  Route::post('/edit-product/{id}', [ProductController::class, 'editProduct']);
  Route::post('/delete-img/{id}', [ProductController::class, 'deleteImg']);
});
  