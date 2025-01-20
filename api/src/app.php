<?php


use Slim\Factory\AppFactory;

global $addHeadersMiddleware, $customErrorHandler;

$app = AppFactory::create();

$app->addRoutingMiddleware();
$app->add($addHeadersMiddleware);
$errorHandler = $app->addErrorMiddleware(true, true, true);
$errorHandler->setDefaultErrorHandler($customErrorHandler);

require __DIR__ . "/routes/index.php";

$app->run();
