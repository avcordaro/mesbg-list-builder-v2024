<?php

namespace MLB\rosters;

use Exception;
use MLB\domain\Roster;
use MLB\domain\User;

class RosterService
{
    private RosterRepository $repository;
    private RosterMapper $mapper;
    private WarbandMapper $warbandMapper;

    public function __construct(RosterRepository $repository, RosterMapper $mapper, WarbandMapper $warbandMapper)
    {
        $this->repository = $repository;
        $this->mapper = $mapper;
        $this->warbandMapper = $warbandMapper;
    }

    /**
     * @throws Exception
     */
    public function createRoster(User $user, object $payload): bool
    {
        $dto = $this->mapper->convertPayloadToDto($payload);
        $roster = $this->mapper->dtoToDomain($dto);
        $warbands = $this->warbandMapper->dtoToDomain($dto->warbands);

        return $this->repository->createRoster($user, $roster, $warbands);
    }

    public function getAllRosters(User $user): string
    {
        $rosters = $this->repository->findAllRosters($user);

        $dto = array_map(function ($roster) {
            /* @var Roster $roster */
            $warbands = $this->warbandMapper->domainToDto($roster->getWarbands());
            return $this->mapper->domainToDto($roster, $warbands);
        }, $rosters);

        return $this->mapper->convertDtoToJson($dto);
    }
}