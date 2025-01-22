<?php

require __DIR__ . '/../vendor/autoload.php';

global $container, $customErrorHandler;

use Dotenv\Dotenv;
use DI\Bridge\Slim\Bridge;
use MLB\core\error\MlbErrorHandler;
use MLB\core\middleware\CorsMiddleware;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '../../');
$dotenv->load();

require __DIR__ . "/../src/config/Container.php";

$app = Bridge::create($container);

$app->add(new CorsMiddleware());
$errorHandler = $app->addErrorMiddleware(true, true, true);
$errorHandler->setDefaultErrorHandler(new MlbErrorHandler());

require __DIR__ . "/../src/route-mapping/routes.php";

$app->run();