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
            $rosterId = $this->upsertRoster($user, $roster);

            if ($rosterId) {
                foreach ($warbands as $warband) {
                    $this->upsertWarband($rosterId, $warband);
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

    public function findRoster(User $user, string $rosterSlug): ?Roster
    {
        $sql = "
            SELECT r.*, w.*
            FROM rosters r
            JOIN warbands w ON r.id = w.roster_id
            WHERE r.user_id = :user_id AND r.slug = :roster_slug;
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':user_id' => $user->getFirebaseId(),
            ':roster_slug' => $rosterSlug
        ]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $rosters = $this->mapper->assocArrayToDomain($result);

        return count($rosters) !== 0 ? $rosters[0] : null;
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


    /**
     * @throws Exception
     */
    public function updateRoster(User $user, Roster $roster, array $warbands): bool
    {
        try {
            $this->pdo->beginTransaction();
            $this->upsertRoster($user, $roster, "update");

            foreach ($warbands as $warband) {
                $this->upsertWarband($roster->getId(), $warband, "update");
            }

            $this->deleteRemovedWarbands(
                $roster->getId(),
                array_map(fn(Warband $warband) => $warband->getId(), $warbands)
            );

            $this->pdo->commit();
        } catch (Exception $e) {
            // Rollback the transaction if something went wrong
            $this->pdo->rollBack();
            throw $e;
        }

        return true;
    }

    public function deleteRoster(User $user, string $rosterSlug): bool
    {
        $sql = "
            DELETE FROM `rosters`
            WHERE `user_id` = :user_id AND `slug` = :roster_slug;
        ";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':user_id' => $user->getFirebaseId(),
            ':roster_slug' => $rosterSlug
        ]);
    }

    private function upsertRoster(User $user, Roster $roster, string $mode = "insert"): string|false
    {
        $updateSql = "
            UPDATE `rosters` 
            SET `version`= :version,
                `roster_group`= :roster_group,
                `name`= :roster_name,
                `army_list`= :army_list,
                `edition`= :edition,
                `meta_leader`= :meta_leader,
                `meta_siege_roster`= :meta_siege_roster,
                `meta_siege_role`= :meta_siege_role,
                `meta_max_points`= :meta_max_points,
                `meta_ttt_special_upgrades`= :meta_ttt_special_upgrades
            WHERE `user_id`= :user_id AND `slug`= :slug
        ";
        $insertSql = "
            INSERT INTO `rosters` (`id`, `user_id`, `slug`, `version`, `roster_group`, `name`, `army_list`, `edition`, `meta_leader`, `meta_siege_roster`, `meta_siege_role`, `meta_max_points`, `meta_ttt_special_upgrades`) 
            VALUES (NULL, :user_id, :slug, :version, :roster_group, :roster_name, :army_list, :edition, :meta_leader, :meta_siege_roster, :meta_siege_role, :meta_max_points, :meta_ttt_special_upgrades)
        ";
        $stmt = $this->pdo->prepare(($mode == "insert") ? $insertSql : $updateSql);
        $stmt->execute([
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

    private function upsertWarband(string $rosterId, Warband $warband, string $mode = "insert"): void
    {
        $updateSql = "
            UPDATE `warbands` 
            SET `hero_id`= :hero_id,
                `hero_model_id`= :hero_model_id,
                `hero_mwfw`= :hero_mwfw,
                `hero_options`= :hero_options,
                `hero_compulsory`= :hero_compulsory,
                `meta_num`= :meta_num,
                `meta_points`= :meta_points,
                `meta_units`= :meta_units,
                `meta_heroes`= :meta_heroes,
                `meta_bows`= :meta_bows,
                `meta_throwing_weapons`= :meta_throwing_weapons,
                `meta_bow_limit`= :meta_bow_limit,
                `meta_throw_limit`= :meta_throw_limit,
                `meta_max_units`= :meta_max_units,
                `units`= :units 
            WHERE `roster_id` = :roster_id AND `warband_id` = :warband_id
       ";
        $insertSql = "
            INSERT INTO `warbands` (`roster_id`, `id`, `warband_id`, `hero_id`, `hero_model_id`, `hero_mwfw`, `hero_options`, `hero_compulsory`, `meta_num`, `meta_points`, `meta_units`, `meta_heroes`, `meta_bows`, `meta_throwing_weapons`, `meta_bow_limit`, `meta_throw_limit`, `meta_max_units`, `units`) 
            VALUES (:roster_id, NULL, :warband_id, :hero_id, :hero_model_id, :hero_mwfw, :hero_options, :hero_compulsory, :meta_num, :meta_points, :meta_units, :meta_heroes, :meta_bows, :meta_throwing_weapons, :meta_bow_limit, :meta_throw_limit, :meta_max_units, :units)
        ";
        $stmt = $this->pdo->prepare(($mode == "insert") ? $insertSql : $updateSql);
        $stmt->execute([
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

    private function deleteRemovedWarbands(int $rosterId, array $warbandIds): void
    {
        $placeholders = rtrim(str_repeat('?,', count($warbandIds)), ',');

        $sql = "
            DELETE FROM warbands 
            WHERE roster_id = ? AND warband_id NOT IN ($placeholders)
        ";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(array_merge([$rosterId], $warbandIds));
    }
}