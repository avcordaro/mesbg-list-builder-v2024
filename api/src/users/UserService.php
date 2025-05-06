<?php

namespace MLB\users;

use MLB\core\Database;
use MLB\domain\User;
use PDO;
use Psr\Http\Message\ServerRequestInterface as Request;

class UserService {

    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getPDO();
    }

    public function upsertUserInteraction(Request $request): User
    {
        $user = $this->getUser($request);
        $stmt = $this->pdo->prepare("
            INSERT INTO `users` (`firebase_id`, `name`, `provider`, `created`, `last_activity`)
            VALUES (:firebase_id, :display_name, :auth_provider, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
            ON DUPLICATE KEY UPDATE `last_activity` = CURRENT_TIMESTAMP();
        ");

        $firebaseId = $user->getFirebaseId();
        $stmt->bindParam(':firebase_id', $firebaseId, PDO::PARAM_INT);

        $displayName = $user->getName();
        $stmt->bindParam(':display_name', $displayName, PDO::PARAM_INT);

        $provider = $user->getProvider();
        $stmt->bindParam(':auth_provider', $provider, PDO::PARAM_INT);

        $stmt->execute();

        return $user;
    }

    private function getUser(Request $request): User
    {
        $userId = $request->getAttribute('user');
        $name = $request->getAttribute('name');
        $provider = $request->getAttribute('provider');

        return new User($userId, $name, $provider);
    }
}