<?php

namespace MLB\rosters;

use PDO;

class RosterRepository
{
    private PDO $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }
}