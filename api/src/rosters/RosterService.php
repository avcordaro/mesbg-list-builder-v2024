<?php

namespace MLB\rosters;

class RosterService
{
    private RosterRepository $repository;

    public function __construct(RosterRepository $repository)
    {
        $this->repository = $repository;
    }
}