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
        $this->userService->upsertUserInteraction($request);

        $responseData = array("Hello" => "World!");
        $responsePayload = json_encode($responseData);
        $response->getBody()->write($responsePayload);

        return $response;
    }


}