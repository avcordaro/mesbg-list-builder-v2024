<?php

namespace MLB\rosters;

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

    public function createRoster(User $user, object $payload): void
    {
        $dto = $this->mapper->convertPayloadToDTO($payload);
        $roster = $this->mapper->dtoToDomain($dto);
        $warbands = $this->warbandMapper->dtoToDomain($dto->warbands);

        $this->repository->createRoster($user, $roster, $warbands);
    }
}