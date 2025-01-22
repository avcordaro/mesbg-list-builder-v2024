<?php

global $app;

use MLB\core\middleware\TokenMiddleware;
use MLB\users\UserController;

$app->post('/v2024/test', [UserController::class, 'test'])->add(TokenMiddleware::class);
