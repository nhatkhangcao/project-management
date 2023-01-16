<?php

namespace App\Repositories\User;

use App\Models\User;

class UserRepository implements UserRepositoryInterface
{

    protected $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function createTokenUser($request)
    {
        $user = $this->user->where('email', $request->email)->first();
        return $user->createToken('token')->plainTextToken;
    }
    public function getListUser()
    {
        $user = $this->user->select('id', 'name', 'email', 'role', 'is_active')->where('is_delete', 0)->orderBy('id', 'DESC')->paginate(20);
        return $user;
    }
    public function getUserByEmail($request)
    {
        $user = $this->user->where('email', $request->email)->first();
        return $user;
    }
    public function searchUser($request)
    {
        $user = $this->user->where('is_delete', 0);
        if (isset($request->name)) {
            $user->where('name', 'LIKE', '%' . $request->name . '%');
        }
        if (isset($request->email)) {
            $user->where('email', 'LIKE', '%' . $request->email . '%');
        }

        if (isset($request->role) && $request->role != 'role') {
            $user->where('role', $request->role);
        }
        if (isset($request->is_active) && $request->is_active != 'is_active') {
            $user->where('is_active', $request->is_active);
        }
        return $user->orderBy('id', 'DESC')->paginate(20);
    }
    public function addUser($request)
    {
        $user = $this->user->create($request->all());
        return $user;
    }
    public function editUser($id, $request)
    {

        $user = $this->user->find($id)->update($request->all());
        return $user;
    }
    public function destroyUser($id)
    {
        $user = $this->user->find($id)->update(['is_delete' => 1]);
        return $user;
    }
    public function blockUser($id)
    {
        $user = $this->user->find($id);
        return $user;
    }
}