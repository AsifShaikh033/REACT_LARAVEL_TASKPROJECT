<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserDashboardController extends Controller
{
    /**
     * Return the authenticated user's profile and task statistics.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $tasks = $user->tasks();

        $statistics = [
            'total' => (clone $tasks)->count(),
            'pending' => (clone $tasks)
                ->where('status', 'pending')
                ->count(),
            'in_progress' => (clone $tasks)
                ->where('status', 'in_progress')
                ->count(),
            'completed' => (clone $tasks)
                ->where('status', 'completed')
                ->count(),
        ];

        $recentTasks = $user->tasks()
            ->latest('updated_at')
            ->limit(5)
            ->get([
                'id',
                'title',
                'priority',
                'status',
                'due_date',
                'updated_at',
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Dashboard data fetched successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'avatar' => $user->avatar
                                    ? Storage::disk('public')->url($user->avatar)
                                    : null, 
                ],
                'statistics' => $statistics,
                'recent_tasks' => $recentTasks,
            ],
        ]);
    }

    /**
     * Update the authenticated user's own profile.
     */

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                \Illuminate\Validation\Rule::unique('users', 'email')
                    ->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = \Illuminate\Support\Facades\Hash::make(
                $validated['password']
            );
        }

        if ($request->hasFile('avatar')) {
            // Delete the old avatar if it exists on public storage.
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Save the new image under storage/app/public/avatars.
            $user->avatar = $request->file('avatar')
                ->store('avatars', 'public');
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'avatar' => $user->avatar
                        ? Storage::disk('public')->url($user->avatar)
                        : null,
                ],
            ],
        ]);
    }

}
