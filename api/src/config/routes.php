<?php

global $app;

use MLB\core\middleware\TokenMiddleware;
use MLB\rosters\RosterController;
use Slim\Routing\RouteCollectorProxy;


$app->group("/v2024", function (RouteCollectorProxy $v2024) {
    $v2024->group("/rosters", function (RouteCollectorProxy $rosters) {
        $rosters->post("", [RosterController::class, 'create'])->add(TokenMiddleware::class);
    });
});

