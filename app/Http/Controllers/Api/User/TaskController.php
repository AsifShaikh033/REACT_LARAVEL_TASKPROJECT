<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    /**
     * Get tasks belonging to the authenticated user.
     */

        public function index(Request $request): JsonResponse
        {
            $validated = $request->validate([
                'search' => ['nullable', 'string', 'max:255'],
                'status' => [
                    'nullable',
                    Rule::in(['pending', 'in_progress', 'completed']),
                ],
                'priority' => [
                    'nullable',
                    Rule::in(['low', 'medium', 'high']),
                ],
                'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            ]);

            $query = $request->user()->tasks();

            if (!empty($validated['search'])) {
                $search = $validated['search'];

                $query->where(function ($builder) use ($search) {
                    $builder
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            }

            if (!empty($validated['status'])) {
                $query->where('status', $validated['status']);
            }

            if (!empty($validated['priority'])) {
                $query->where('priority', $validated['priority']);
            }

            $tasks = $query
                ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
                ->orderBy('due_date')
                ->latest('id')
                ->paginate($validated['per_page'] ?? 9)
                ->withQueryString();

            return response()->json([
                'success' => true,
                'message' => 'Tasks fetched successfully.',
                'data' => $tasks,
            ]);
        }

    /**
     * Create a task for the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => [
                'sometimes',
                'required',
                Rule::in(['low', 'medium', 'high']),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in(['pending', 'in_progress', 'completed']),
            ],
            'due_date' => ['nullable', 'date'],
        ]);

        $task = $request->user()
            ->tasks()
            ->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task created successfully.',
            'data' => $task,
        ], 201);
    }

    /**
     * Get one task owned by the authenticated user.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $task = $request->user()
            ->tasks()
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Task fetched successfully.',
            'data' => $task,
        ]);
    }

    /**
     * Update a task owned by the authenticated user.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $task = $request->user()
            ->tasks()
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'priority' => [
                'sometimes',
                'required',
                Rule::in(['low', 'medium', 'high']),
            ],
            'status' => [
                'sometimes',
                'required',
                Rule::in(['pending', 'in_progress', 'completed']),
            ],
            'due_date' => ['sometimes', 'nullable', 'date'],
        ]);

        $task->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data' => $task->fresh(),
        ]);
    }

    /**
     * Delete a task owned by the authenticated user.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $task = $request->user()
            ->tasks()
            ->findOrFail($id);

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully.',
        ]);
    }
}
