<?php

namespace MLB\matches;

use MLB\core\Database;
use MLB\domain\Game;
use MLB\domain\User;
use PDO;

class GameRepository
{
    private PDO $pdo;
    private GameMapper $mapper;

    public function __construct(Database $database, GameMapper $mapper)
    {
        $this->pdo = $database->getPDO();
        $this->mapper = $mapper;
    }

    public function create(User $user, Game $game): bool
    {
        $sql = "
            INSERT INTO `games`(`id`, `user_id`, `game_date`, `duration`, `points`, `match_result`, `scenario_played`, `tags`, `armies`, `bows`, `throwing_weapons`, `victory_points`, `opponent_armies`, `opponent_name`, `opponent_victory_points`)
            VALUES(:game_id, :user_id, :game_date, :duration, :points, :match_result, :scenario_played, :tags, :armies, :bows, :throwing_weapons, :victory_points, :opponent_armies, :opponent_name, :opponent_victory_points)
        ";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':game_id' => $game->getId(),
            ':user_id' => $user->getFirebaseId(),
            ':game_date' => $game->getGameDate(),
            ':duration' => $game->getDuration(),
            ':points' => $game->getPoints(),
            ':match_result' => $game->getMatchResult(),
            ':scenario_played' => $game->getScenarioPlayed(),
            ':tags' => $game->getTags(),
            ':armies' => $game->getArmies(),
            ':bows' => $game->getBows(),
            ':throwing_weapons' => $game->getThrowingWeapons(),
            ':victory_points' => $game->getVictoryPoints(),
            ':opponent_armies' => $game->getOpponentArmies(),
            ':opponent_name' => $game->getOpponentName(),
            ':opponent_victory_points' => $game->getOpponentVictoryPoints()
        ]);
    }

    public function read(User $user): array
    {
        $sql = "
            SELECT *
            FROM `games`
            WHERE `user_id` = :user_id
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $user->getFirebaseId(),
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $this->mapper->assocArrayToDomain($result);
    }

    public function updated(User $user, Game $game): bool
    {
        $sql = "
            UPDATE `games` 
            SET `game_date`= :game_date,
                `duration`= :duration,
                `points`= :points,
                `match_result`= :match_result,
                `scenario_played`= :scenario_played,
                `tags`= :tags,
                `armies`= :armies,
                `bows`= :bows,
                `throwing_weapons`= :throwing_weapons,
                `victory_points`= :victory_points,
                `opponent_armies`= :opponent_armies,
                `opponent_name`= :opponent_name,
                `opponent_victory_points`= :opponent_victory_points 
            WHERE `user_id` = :user_id AND `id` = :game_id
        ";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':game_id' => $game->getId(),
            ':user_id' => $user->getFirebaseId(),
            ':game_date' => $game->getGameDate(),
            ':duration' => $game->getDuration(),
            ':points' => $game->getPoints(),
            ':match_result' => $game->getMatchResult(),
            ':scenario_played' => $game->getScenarioPlayed(),
            ':tags' => $game->getTags(),
            ':armies' => $game->getArmies(),
            ':bows' => $game->getBows(),
            ':throwing_weapons' => $game->getThrowingWeapons(),
            ':victory_points' => $game->getVictoryPoints(),
            ':opponent_armies' => $game->getOpponentArmies(),
            ':opponent_name' => $game->getOpponentName(),
            ':opponent_victory_points' => $game->getOpponentVictoryPoints()
        ]);
    }

    public function delete(User $user, string $gameId): bool
    {
        $sql = "
            DELETE FROM `games`
            WHERE `user_id` = :user_id AND `id` = :game_id
        ";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $user->getFirebaseId(),
            ':game_id' => $gameId
        ]);
    }

}