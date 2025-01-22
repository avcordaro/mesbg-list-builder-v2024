<?php

namespace MLB\rosters;

use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerBuilder;
use MLB\domain\builders\RosterBuilder;
use MLB\domain\Roster;
use MLB\rosters\dto\RosterDTO;

class RosterMapper
{
    private Serializer $serializer;

    public function __construct()
    {
        $this->serializer = SerializerBuilder::create()->build();
    }

    public function convertPayloadToDTO(object $payload): RosterDTO
    {
        return $this->serializer->deserialize($payload, RosterDTO::class, 'json');
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
            ->setMetaTttSpecialUpgrades(json_encode($dto->metadata->tttSpecialRules))
            ->build();
    }
}