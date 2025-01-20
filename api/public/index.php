<?php

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/autoload.php';

use Dotenv\Dotenv;

global $pdo, $firebase, $customErrorHandler, $addHeadersMiddleware, $tokenMiddleware;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '../../');
$dotenv->load();

require __DIR__ . "/../src/dependencies/dependencies.php";
require __DIR__ . "/../src/app.php";

