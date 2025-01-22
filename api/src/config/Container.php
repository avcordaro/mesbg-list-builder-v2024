<?php

require __DIR__ . '/../core/middleware/index.php';

use MLB\core\Database as Database;
use MLB\core\FireAuth as FireAuth;
use DI\Container as Container;
use Kreait\Firebase\Contract\Auth;
use MLB\users\UserController;
use MLB\users\UserService;
use Psr\Container\ContainerInterface;

global $firebase, $pdo;

$fireAuth = new FireAuth();
$database = new Database();

$container = new Container();
$container->set(PDO::class, $database->getPDO());
$container->set(Auth::class, $fireAuth->getAuth());

$container->set(UserService::class, fn(ContainerInterface $container) => new UserService($container->get(PDO::class)));
$container->set(UserController::class, fn(ContainerInterface $container) => new UserController($container->get(UserService::class)));
