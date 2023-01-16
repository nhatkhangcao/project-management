<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Repositories\User\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class LoginController extends Controller
{
    protected $userRepository;
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function login(LoginRequest $request)
    {
        $dataLogin = [
            'email' => $request->email,
            'password' => $request->password,

        ];
        $remember = $request->remember?true:false;

        if (Auth::attempt($dataLogin, $remember)) {
            $token = $this->userRepository->createTokenUser($request);
            return response()->json([
                'user' => [
                    "name" => auth()->user()->name,
                    "remember_token" => auth()->user()->getRememberToken(),
                ],
                'token' => $token,
            ]);
        }
        return response()->json([
            'message' => 'Password or Email is Wrong',
            'code' => '201'
        ]);
    }
}