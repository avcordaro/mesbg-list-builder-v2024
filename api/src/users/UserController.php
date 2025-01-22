<?php

namespace MLB\users;

global $app;

use MLB\core\middleware\TokenMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function test(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user');
        $name = $request->getAttribute('name');
        $provider = $request->getAttribute('provider');

        $user = new User($userId, $name, $provider);
        $this->userService->upsertUser($user);

        $responseData = array(
            "user_id" => $userId,
            "name" => $name,
            "provider" => $provider
        );
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

        return $response;
    }
}

