<?php

namespace MLB\rosters;

use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerBuilder;
use MLB\domain\builders\RosterBuilder;
use MLB\domain\builders\WarbandBuilder;
use MLB\domain\Roster;
use MLB\rosters\dto\MetadataDTO;
use MLB\rosters\dto\RosterDTO;

class RosterMapper
{
    private Serializer $serializer;

    public function __construct()
    {
        $this->serializer = SerializerBuilder::create()->build();
    }

    public function convertPayloadToDto(object $payload): RosterDTO
    {
        return $this->serializer->deserialize($payload, RosterDTO::class, 'json');
    }

    public function convertDtoToJson(mixed $dto): string
    {
        return $this->serializer->serialize($dto, "json");
    }


    public function dtoToDomain(RosterDTO $dto): Roster
    {
        return (new RosterBuilder())
            ->setId($dto->metadata->dbId)
            ->setUserId($dto->metadata->userId)
            ->setEdition($dto->edition)
            ->setArmyList($dto->armyList)
            ->setName($dto->name)
            ->setVersion($dto->version)
            ->setRosterGroup($dto->group)
            ->setSlug($dto->id)
            ->setMetaLeader($dto->metadata->leader)
            ->setMetaMaxPoints($dto->metadata->maxPoints)
            ->setMetaSiegeRoster($dto->metadata->siegeRoster)
            ->setMetaSiegeRole($dto->metadata->siegeRole)
            ->setMetaTttSpecialUpgrades(json_encode($dto->metadata->tttSpecialUpgrades))
            ->build();
    }

    public function domainToDto(Roster $roster, array $warbands): RosterDTO
    {
        $dto = new RosterDTO();

        $metadata = new MetadataDTO();
        $metadata->dbId = $roster->getId();
        $metadata->userId = $roster->getUserId();
        $metadata->leader = $roster->getMetaLeader();
        $metadata->siegeRoster = $roster->getMetaSiegeRoster();
        $metadata->siegeRole = $roster->getMetaSiegeRole();
        $metadata->maxPoints = $roster->getMetaMaxPoints();
        $metadata->tttSpecialUpgrades = json_decode($roster->getMetaTttSpecialUpgrades());

        $dto->metadata = $metadata;
        $dto->warbands = $warbands;
        $dto->id = $roster->getSlug();
        $dto->version = $roster->getVersion();
        $dto->name = $roster->getName();
        $dto->group = $roster->getRosterGroup();
        $dto->armyList = $roster->getArmyList();
        $dto->edition = $roster->getEdition();

        return $dto;
    }

    public function assocArrayToDomain(array $rows): array
    {
        $rosters = [];
        foreach ($rows as $row) {
            $roster_id = $row['roster_id'];
            if (!isset($rosters[$roster_id])) {
                $rosters[$roster_id] = (new RosterBuilder())
                    ->setId($row['roster_id'])
                    ->setUserId($row["user_id"])
                    ->setSlug($row["slug"])
                    ->setVersion($row["version"])
                    ->setRosterGroup($row["roster_group"])
                    ->setName($row["name"])
                    ->setArmyList($row["army_list"])
                    ->setEdition($row["edition"])
                    ->setMetaLeader($row["meta_leader"])
                    ->setMetaSiegeRoster($row["meta_siege_roster"])
                    ->setMetaSiegeRole($row["meta_siege_role"])
                    ->setMetaMaxPoints($row["meta_max_points"])
                    ->setMetaTttSpecialUpgrades($row["meta_ttt_special_upgrades"])
                    ->build();
            }

            // If there's a warband associated, add it to the roster
            if (!empty($row['warband_id'])) {
                $rosters[$roster_id]->getWarbands()[] = (new WarbandBuilder())
                    ->setRosterId($row['roster_id'])
                    ->setId($row['warband_id'])
                    ->setHeroId($row['hero_id'])
                    ->setHeroModelId($row['hero_model_id'])
                    ->setHeroMwfw($row['hero_mwfw'])
                    ->setHeroOptions($row['hero_options'])
                    ->setHeroCompulsory($row['hero_compulsory'])
                    ->setMetaNum($row["meta_num"])
                    ->setMetaPoints($row["meta_points"])
                    ->setMetaMaxUnits($row["meta_max_units"])
                    ->setMetaUnits($row["meta_units"])
                    ->setMetaHeroes($row["meta_heroes"])
                    ->setMetaBows($row["meta_bows"])
                    ->setMetaBowLimit($row["meta_bow_limit"])
                    ->setMetaThrowingWeapons($row["meta_throw_limit"])
                    ->setMetaThrowLimit($row["meta_throw_limit"])
                    ->setUnits($row["units"])
                    ->build();
            }
        }
        return array_values($rosters);
    }
}