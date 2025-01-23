<?php

namespace MLB\matches;

use Exception;
use MLB\users\UserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class GameController
{
    private UserService $userService;
    private GameService $service;

    public function __construct(GameService $service, UserService $userService)
    {
        $this->service = $service;
        $this->userService = $userService;
    }

    public function create(Request $request, Response $response): Response
    {
        try {
            $user = $this->userService->upsertUserInteraction($request);
            $created = $this->service->create($user, $request->getBody());

            return $response->withStatus(($created) ? 201 : 500);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode(array("error" => $e->getMessage())));
            return $response->withStatus(500);
        }
    }

    public function read(Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $games = $this->service->read($user);

        $response->getBody()->write($games);

        return $response;
    }

    public function update($gameId, Request $request, Response $response): Response
    {
        try {
            $user = $this->userService->upsertUserInteraction($request);
            $updated = $this->service->updated($user, $gameId, $request->getBody());

            return $response->withStatus(($updated) ? 204 : 500);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode(array("error" => $e->getMessage())));
            return $response->withStatus(500);
        }
    }

    public function delete($gameId, Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $deleted = $this->service->delete($user, $gameId);

        if ($deleted) {
            return $response->withStatus(204);
        } else {
            return $response->withStatus(500);
        }
    }
}