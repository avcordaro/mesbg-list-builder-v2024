<?php

namespace MLB\collection;

use MLB\users\UserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class CollectionController
{
    private UserService $userService;
    private CollectionService $service;

    public function __construct(UserService $userService, CollectionService $service)
    {
        $this->userService = $userService;
        $this->service = $service;
    }

    public function upsert($origin, $model, Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $success = $this->service->upsert($user, $origin, $model, $request->getBody());

        return $response->withStatus($success ? 204 : 500);
    }

    public function get(Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $collection = $this->service->get($user);

        $response->getBody()->write($collection);

        return $response;
    }

    public function remove($origin, $model, Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $success = $this->service->remove($user, $origin, $model);

        return $response->withStatus($success ? 204 : 500);
    }
}