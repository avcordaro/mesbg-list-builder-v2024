<?php

global $app;

use MLB\core\middleware\TokenMiddleware;
use MLB\rosters\RosterController;

$app->group("/v2024", function () use ($app) {
    $app->post('/test', [RosterController::class, 'create'])->add(TokenMiddleware::class);
});

