<?php

namespace MLB\rosters;

use Exception;
use MLB\domain\User;
use MLB\users\UserService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class RosterController
{
    private UserService $userService;
    private RosterService $rosterService;

    public function __construct(
        UserService   $userService,
        RosterService $rosterService
    )
    {
        $this->userService = $userService;
        $this->rosterService = $rosterService;
    }

    public function create(Request $request, Response $response): Response
    {
        try {
            $user = $this->userService->upsertUserInteraction($request);
            $created = $this->rosterService->createRoster($user, $request->getBody());

            return $response
                ->withStatus(($created) ? 204 : 500);
        } catch (Exception $e) {
            $response->getBody()->write(json_encode(array("error" => $e->getMessage())));
            return $response->withStatus(500);
        }
    }

    public function findAll(Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $rosters = $this->rosterService->getAllRosters($user);

        $response->getBody()->write($rosters);

        return $response;
    }

    public function find($rosterId, Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $roster = $this->rosterService->findRosterBySlug($user, $rosterId);

        if (is_null($roster)) {
            return $response->withStatus(404);
        }

        $response->getBody()->write($roster);
        return $response;
    }

    public function findShared($userId, $rosterId, Response $response): Response
    {
        $user = new User($userId, "shared", "shared");
        $roster = $this->rosterService->findRosterBySlug($user, $rosterId);

        if (is_null($roster)) {
            return $response->withStatus(404);
        }

        $response->getBody()->write($roster);
        return $response;
    }

    public function update(Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);

        $responseData = array("Hello" => "World!", "user" => $user);
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

        return $response;
    }

    public function delete($rosterId, Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);
        $deleted = $this->rosterService->deleteRoster($user, $rosterId);

        if ($deleted) {
            return $response->withStatus(204);
        } else {
            return $response->withStatus(500);
        }
    }
}