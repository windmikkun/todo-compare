<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

$todos = [];
$nextId = 1;

Route::get('/laravelTodos', function () use (&$todos) {
    return response()->json($todos);
});

Route::post('/laravelTodos', function (Request $request) use (&$todos, &$nextId) {
    $title = trim((string)$request->input('title', ''));
    if ($title === '') {
        return response()->json(['message' => 'title is required'], 400);
    }

    $todo = [
        'id' => $nextId++,
        'title' => $title,
        'completed' => false,
    ];

    $todos[] = $todo;
    return response()->json($todo, 201);
});

Route::delete('/laravelTodos/{id}', function ($id) use (&$todos) {
    $id = (int)$id;

    foreach ($todos as $i => $t) {
        if ($t['id'] === $id) {
            array_splice($todos, $i, 1);
            return response()->noContent();
        }
    }

    return response()->json(['message' => 'not found'], 404);
});

