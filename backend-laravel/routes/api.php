<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


function loadTodos(): array
{
    $path = storage_path('app/laravel_todos.json');
    if (!file_exists($path)) {
        return [];
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : [];
}

function saveTodos(array $todos): void
{
    $path = storage_path('app/laravel_todos.json');
    file_put_contents($path, json_encode($todos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

Route::get('/laravelTodos', function () {
    return response()->json(loadTodos());
});

Route::post('/laravelTodos', function (Request $request) {
    $title = trim((string)$request->input('title', ''));
    if ($title === '') {
        return response()->json(['message' => 'title is required'], 400);
    }

    $todos = loadTodos();
    $nextId = empty($todos) ? 1 : (max(array_column($todos, 'id')) + 1);

    $todo = [
        'id' => $nextId,
        'title' => $title,
        'completed' => false,
    ];

    $todos[] = $todo;
    saveTodos($todos);

    return response()->json($todo, 201);
});

Route::delete('/laravelTodos/{id}', function ($id) {
    $id = (int)$id;
    $todos = loadTodos();

    foreach ($todos as $i => $t) {
        if ($t['id'] === $id) {
            array_splice($todos, $i, 1);
            saveTodos($todos);
            return response()->noContent();
        }
    }

    return response()->json(['message' => 'not found'], 404);
});

