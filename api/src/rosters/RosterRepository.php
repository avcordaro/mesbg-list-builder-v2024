<?php

namespace MLB\rosters;

use MLB\core\Database;
use PDO;

class RosterRepository
{
    private PDO $pdo;

    public function __construct(Database $database)
    {
        $this->pdo = $database->getPDO();
    }
}