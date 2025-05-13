<?php

namespace MLB\collection;

use MLB\core\Database;
use MLB\domain\Collection;
use MLB\domain\User;
use PDO;

class CollectionRepository
{
    private PDO $pdo;
    private CollectionMapper $mapper;

    public function __construct(Database $database, CollectionMapper $mapper)
    {
        $this->pdo = $database->getPDO();
        $this->mapper = $mapper;
    }

    public function upsert(Collection $collection): bool
    {
        $sql = "
            INSERT INTO `collections` (`id`, `user_id`, `origin`, `model`, `collection`) 
            VALUES (NULL, :user_id, :origin, :model, :collection)
            ON DUPLICATE KEY UPDATE `collection` = :collection_update;
        ";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $collection->getUserId(),
            ':origin' => $collection->getOrigin(),
            ':model' => $collection->getModel(),
            ':collection' => $collection->getCollection(),
            ':collection_update' => $collection->getCollection(),
        ]);
    }

    public function delete(User $user, string $origin, string $model): bool
    {
        $sql = "
            DELETE 
            FROM `collections` 
            WHERE user_id = :user_id AND origin = :origin AND model = :model;
        ";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $user->getFirebaseId(),
            ':origin' => $origin,
            ':model' => $model,
        ]);
    }

    public function findAll(User $user): array
    {
        $sql = "
            SELECT * 
            FROM `collections` 
            WHERE user_id = :user_id;
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $user->getFirebaseId()
        ]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}