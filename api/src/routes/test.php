<?php

use App\users\User;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

global $app, $tokenMiddleware;

$app->get('/v2024/test', function (Request $request, Response $response) {
    $responseData = array(
        "hello" => "world!",

    );
    $responsePayload = json_encode($responseData);
    $response->getBody()->write($responsePayload);

    return $response;
});

$app->post('/v2024/test', function (Request $request, Response $response) {
    $userService = $this->get("userService");

    $userId = $request->getAttribute('user');
    $name = $request->getAttribute('name');
    $provider = $request->getAttribute('provider');

    $user = new User($userId, $name, $provider);
    $userService->upsertUser($user);

    $responseData = array(
        "user_id" => $userId,
        "name" => $name,
        "provider" => $provider
    );
    $responsePayload = json_encode($responseData);
    $response->getBody()->write($responsePayload);

    return $response;
})->add($tokenMiddleware);