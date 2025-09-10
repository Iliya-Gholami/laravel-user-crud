<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Validate user data.
     */
    protected function validateUser(Request $request, bool $isNewUser = true): array
    {
        $rules = [
            'name' => 'required|min:3|max:70',
            'email' => 'required|email' . ($isNewUser ? '|unique:users' : ''),
            'password' => 'required|min:6'
        ];

        return $request->validate($rules);
    }

    /**
     * Handles the response for invalid user data during validation.
     */
    protected function handleInvalidUser(ValidationException $e): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
            'errors'  => $e->validator->errors() 
        ], 422);
    }

    /**
     * Display a listing of the resource.
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
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $this->validateUser($request);
        } catch (ValidationException $e) {
            return $this->handleInvalidUser($e);
        }

        User::create($data);

        return response()->json([
            'success' => true,
            'message' => 'User has been created successfully'
        ]);
    }

    /**
     * Display the specified resource.
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
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $data = $this->validateUser($request, false);
        } catch (ValidationException $e) {
            return $this->handleInvalidUser($e);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User has been updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
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
