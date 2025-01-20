<?php

require __DIR__ . '/../middleware/index.php';
require __DIR__ . '/database.php';
require __DIR__ . '/firebase.php';

use App\users\UserService;
use DI\Container as Container;
use Psr\Container\ContainerInterface;
use Slim\Factory\AppFactory;

global $firebase, $pdo;

$container = new Container();
$container->set("db", $pdo);
$container->set("auth", $firebase);

$container->set("userService",
    fn(ContainerInterface $container) => new UserService($container->get("db"))
);

AppFactory::setContainer($container);
