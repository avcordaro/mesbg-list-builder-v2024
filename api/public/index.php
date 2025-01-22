<?php

require __DIR__ . '/../vendor/autoload.php';

global $container, $addHeadersMiddleware, $customErrorHandler;

use Dotenv\Dotenv;
use DI\Bridge\Slim\Bridge;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '../../');
$dotenv->load();

require __DIR__ . "/../src/config/Container.php";

$app = Bridge::create($container);

$app->add($addHeadersMiddleware);
$errorHandler = $app->addErrorMiddleware(true, true, true);
$errorHandler->setDefaultErrorHandler($customErrorHandler);

require __DIR__ . "/../src/route-mapping/routes.php";

$app->run();