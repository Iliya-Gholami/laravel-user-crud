<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserRequest;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'users'   => User::paginate(10)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * 
     * @param UserRequest $request
     * @return JsonResponse
     */
    public function store(UserRequest $request): JsonResponse
    {
        User::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User has been created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     * 
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'success' => true,
            'user'    => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     * 
     * @param UserRequest $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(UserRequest $request, User $user): JsonResponse
    {
        $user->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'User has been updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * 
     * @param User $user
     * @return JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User has been deleted successfully'
        ]);
    }
}
