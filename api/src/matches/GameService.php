<?php

namespace MLB\matches;

use MLB\domain\Game;
use MLB\domain\User;

class GameService
{
    private GameMapper $mapper;
    private GameRepository $repository;

    public function __construct(GameMapper $mapper, GameRepository $repository)
    {
        $this->mapper = $mapper;
        $this->repository = $repository;
    }

    public function create(User $user, object $payload): bool
    {
        $dto = $this->mapper->convertPayloadToDto($payload);
        $game = $this->mapper->dtoToDomain($dto);

        return $this->repository->create($user, $game);
    }

    public function read(User $user): string
    {
        $games = $this->repository->read($user);
        $dtos = array_map(fn(Game $game) => $this->mapper->domainToDto($game), $games);
        return $this->mapper->convertDtoToJson($dtos);
    }

    public function updated(User $user, string $gameId, object $payload): bool
    {
        $dto = $this->mapper->convertPayloadToDto($payload);
        $game = $this->mapper->dtoToDomain($dto);

        if ($gameId != $game->getId()) {
            return false;
        }

        return $this->repository->updated($user, $game);
    }

    public function delete(User $user, string $gameId): bool
    {
        return $this->repository->delete($user, $gameId);
    }
}