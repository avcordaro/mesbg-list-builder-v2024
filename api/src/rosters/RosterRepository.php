<?php

namespace MLB\rosters;

use Exception;
use MLB\core\Database;
use MLB\domain\Roster;
use MLB\domain\User;
use MLB\domain\Warband;
use PDO;

class RosterRepository
{
    private PDO $pdo;
    private RosterMapper $mapper;

    public function __construct(Database $database, RosterMapper $mapper)
    {
        $this->pdo = $database->getPDO();
        $this->mapper = $mapper;
    }

    /**
     * @throws Exception
     */
    public function createRoster(User $user, Roster $roster, array $warbands): bool
    {
        try {
            $this->pdo->beginTransaction();
            $rosterId = $this->insertRoster($user, $roster);

            if ($rosterId) {
                foreach ($warbands as $warband) {
                    $this->insertWarband($rosterId, $warband);
                }
                $this->pdo->commit();
            } else {
                return false;
            }
        } catch (Exception $e) {
            // Rollback the transaction if something went wrong
            $this->pdo->rollBack();
            throw $e;
        }

        return true;
    }

    public function findAllRosters(User $user): array
    {
        $sql = "
            SELECT r.*, w.*
            FROM rosters r
            JOIN warbands w ON r.id = w.roster_id
            WHERE r.user_id = :user_id;
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':user_id' => $user->getFirebaseId()]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $this->mapper->assocArrayToDomain($result);
    }

    private function insertRoster(User $user, Roster $roster): string|false
    {
        $insertRosterSql = "
            INSERT INTO `rosters` (`id`, `user_id`, `slug`, `version`, `roster_group`, `name`, `army_list`, `edition`, `meta_leader`, `meta_siege_roster`, `meta_siege_role`, `meta_max_points`, `meta_ttt_special_upgrades`) 
            VALUES (NULL, :user_id, :slug, :version, :roster_group, :roster_name, :army_list, :edition, :meta_leader, :meta_siege_roster, :meta_siege_role, :meta_max_points, :meta_ttt_special_upgrades)
        ";
        $insertRosterStmt = $this->pdo->prepare($insertRosterSql);
        $insertRosterStmt->execute([
            ':user_id' => $user->getFirebaseId(),
            ':slug' => $roster->getSlug(),
            ':version' => $roster->getVersion(),
            ':roster_group' => $roster->getRosterGroup(),
            ':roster_name' => $roster->getName(),
            ':army_list' => $roster->getArmyList(),
            ':edition' => $roster->getEdition(),
            ':meta_leader' => $roster->getMetaLeader(),
            ':meta_siege_roster' => $roster->getMetaSiegeRoster(),
            ':meta_siege_role' => $roster->getMetaSiegeRole(),
            ':meta_max_points' => $roster->getMetaMaxPoints(),
            ':meta_ttt_special_upgrades' => $roster->getMetaTttSpecialUpgrades(),
        ]);
        return $this->pdo->lastInsertId();
    }

    private function insertWarband(string $rosterId, Warband $warband): void
    {
        $insertWarbandSql = "
            INSERT INTO `warbands` (`roster_id`, `id`, `warband_id`, `hero_id`, `hero_model_id`, `hero_mwfw`, `hero_options`, `hero_compulsory`, `meta_num`, `meta_points`, `meta_units`, `meta_heroes`, `meta_bows`, `meta_throwing_weapons`, `meta_bow_limit`, `meta_throw_limit`, `meta_max_units`, `units`) 
            VALUES (:roster_id, NULL, :warband_id, :hero_id, :hero_model_id, :hero_mwfw, :hero_options, :hero_compulsory, :meta_num, :meta_points, :meta_units, :meta_heroes, :meta_bows, :meta_throwing_weapons, :meta_bow_limit, :meta_throw_limit, :meta_max_units, :units)
        ";
        $insertWarbandStmt = $this->pdo->prepare($insertWarbandSql);
        $insertWarbandStmt->execute([
            ':roster_id' => $rosterId,
            ':warband_id' => $warband->getId(),
            ':hero_id' => $warband->getHeroId(),
            ':hero_model_id' => $warband->getHeroModelId(),
            ':hero_mwfw' => $warband->getHeroMwfw(),
            ':hero_options' => $warband->getHeroOptions(),
            ':hero_compulsory' => $warband->getHeroCompulsory(),
            ':meta_num' => $warband->getMetaNum(),
            ':meta_points' => $warband->getMetaPoints(),
            ':meta_units' => $warband->getMetaUnits(),
            ':meta_heroes' => $warband->getMetaHeroes(),
            ':meta_bows' => $warband->getMetaBows(),
            ':meta_throwing_weapons' => $warband->getMetaThrowingWeapons(),
            ':meta_bow_limit' => $warband->getMetaBowLimit(),
            ':meta_throw_limit' => $warband->getMetaThrowLimit(),
            ':meta_max_units' => $warband->getMetaMaxUnits(),
            ':units' => $warband->getUnits(),
        ]);
    }
}