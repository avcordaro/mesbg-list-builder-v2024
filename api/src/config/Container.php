<?php

require __DIR__ . '/../core/middleware/index.php';

use DI\Container as Container;
use Kreait\Firebase\Contract\Auth;
use MLB\core\Database as Database;
use MLB\core\FireAuth as FireAuth;
use MLB\rosters\RosterController;
use MLB\rosters\RosterRepository;
use MLB\rosters\RosterService;
use MLB\users\UserService;
use Psr\Container\ContainerInterface;

global $firebase, $pdo;

$fireAuth = new FireAuth();
$database = new Database();

$container = new Container();
$container->set(PDO::class, $database->getPDO());
$container->set(Auth::class, $fireAuth->getAuth());

$container->set(UserService::class, function (ContainerInterface $container) {
    return new UserService($container->get(PDO::class));
});
$container->set(RosterRepository::class, function (ContainerInterface $container) {
    return new RosterRepository($container->get(PDO::class));
});
$container->set(RosterService::class, function (ContainerInterface $container) {
    return new RosterService($container->get(RosterRepository::class));
});
$container->set(RosterController::class, function (ContainerInterface $container) {
    return new RosterController($container->get(UserService::class), $container->get(RosterService::class));
});

