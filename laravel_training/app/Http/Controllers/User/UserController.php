<?php

namespace App\Http\Controllers\User;

use App\Repositories\User\UserRepository;
use App\Http\Controllers\Controller;
use App\Http\Requests\AddUserRequest;
use App\Http\Requests\EditUserRequest;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected $userRepository;
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index()
    {
            return $this->userRepository->getListUser(); 
    }

    public function searchUser(Request $request)
    {
        return $this->userRepository->searchUser($request);
    }

    public function addUser(AddUserRequest $request)
    {
        $added = $this->userRepository->addUser($request);
        return $added;
    }
    public function getUserByEmail(Request $request)
    {
        return $this->userRepository->getUserByEmail($request);
    }
    public function editUser($id, EditUserRequest $request)
    {
        $updated = $this->userRepository->editUser($id, $request);
        if ($updated) {
            $response = [
                'code' => 200,
                'status' => 'ok',
            ];
        }
        return $response;
    }
    public function destroyUser($id)
    {
        $destroy = $this->userRepository->destroyUser($id);
        if ($destroy) {
            $response = [
                'code' => 201,
            ];
        }
        return $response;
    }
    public function blockUser($id)
    {
        $block = $this->userRepository->blockUser($id);
        $status = $block->is_active;
        if ($status === 1) {
            $block->update(['is_active' => 0]);
            $response = [
                'status' => 'blocked',
            ];
        } else {
            $block->update(['is_active' => 1]);
            $response = [
                'status' => 'unblocked',
            ];
        }
        return $response;
    }
}