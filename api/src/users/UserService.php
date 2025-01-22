<?php

namespace MLB\users;

use PDO;

class UserService {

    private PDO $pdo;

    /**
     * @param $pdo
     */
    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function upsertUser(User $user): void
    {
        $firebaseId = $user->getFirebaseId();
        $displayName = $user->getName();
        $provider = $user->getProvider();

        $sql = "
            INSERT INTO `users` (`firebase_id`, `name`, `provider`, `created`, `last_activity`)
            VALUES (:firebase_id, :display_name, :auth_provider, CURRENT_TIME(), CURRENT_TIME())
            ON DUPLICATE KEY UPDATE `last_activity` = CURRENT_TIME();
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->bindParam(':firebase_id', $firebaseId, PDO::PARAM_INT);
        $stmt->bindParam(':display_name', $displayName, PDO::PARAM_INT);
        $stmt->bindParam(':auth_provider', $provider, PDO::PARAM_INT);

        $stmt->execute();
    }
}