<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use DI\Container;
use DI\Bridge\Slim\Bridge;
use MLB\core\error\MlbErrorHandler;
use MLB\core\middleware\CorsMiddleware;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '../../');
$dotenv->load();

$app = Bridge::create(new Container());
$app->add(new CorsMiddleware());
$errorHandler = $app->addErrorMiddleware($_ENV["PROFILE"] == "development", true, true);
$errorHandler->setDefaultErrorHandler(new MlbErrorHandler());

require __DIR__ . "/../src/config/routes.php";

$app->run();