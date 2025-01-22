<?php

namespace MLB\rosters;

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
        $user = $this->userService->upsertUserInteraction($request);

        $this->rosterService->createRoster($user, $request->getBody());

        $responseData = array("Hello" => "World!", "user" => $user);
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

        return $response;
    }

    public function findAll(Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);

        $responseData = array("Hello" => "World!", "user" => $user);
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

        return $response;
    }

    public function find($rosterId, Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);

        $responseData = array("Hello" => "World!", "roster" => $rosterId, "user" => $user->getFirebaseId());
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

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

    public function delete(Request $request, Response $response): Response
    {
        $user = $this->userService->upsertUserInteraction($request);

        $responseData = array("Hello" => "World!", "user" => $user);
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

        return $response;
    }
}