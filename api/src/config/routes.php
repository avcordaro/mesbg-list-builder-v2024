<?php

global $app;

use MLB\core\middleware\TokenMiddleware;
use MLB\rosters\RosterController;
use Slim\Routing\RouteCollectorProxy;


$app->group("/v2024", function (RouteCollectorProxy $v2024) {

    $v2024->group("/rosters", function (RouteCollectorProxy $rosters) {

        $rosters->post("", [RosterController::class, 'create'])->add(TokenMiddleware::class);
        $rosters->get("", [RosterController::class, 'findAll'])->add(TokenMiddleware::class);
        $rosters->get("/{rosterId}", [RosterController::class, 'find'])->add(TokenMiddleware::class);
        $rosters->put("/{rosterId}", [RosterController::class, 'update'])->add(TokenMiddleware::class);
        $rosters->delete("/{rosterId}", [RosterController::class, 'delete'])->add(TokenMiddleware::class);

    });

    $v2024->group("/s/{userId}", function (RouteCollectorProxy $shared) {

        $shared->get("/rosters/{rosterId}", [RosterController::class, 'findShared']);

    });

});

