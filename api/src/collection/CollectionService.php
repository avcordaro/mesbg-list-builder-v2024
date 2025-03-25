<?php

namespace MLB\collection;

use MLB\domain\Collection;
use MLB\domain\User;

class CollectionService
{
    private CollectionMapper $mapper;
    private CollectionRepository $repository;

    public function __construct(CollectionMapper $mapper, CollectionRepository $repository)
    {
        $this->mapper = $mapper;
        $this->repository = $repository;
    }

    public function upsert(User $user, string $origin, string $model, object $payload): bool
    {
        $dto = $this->mapper->createDto($user->getFirebaseId(), $origin, $model, $payload);
        $collection = $this->mapper->dtoToDomain($dto);

        return $this->repository->upsert($collection);
    }

    public function get(User $user): string
    {
        $rows = $this->repository->findAll($user);

        $collection = $this->mapper->assocArrayToDomain($rows);
        $dto = array_map(fn(Collection $collection) => $this->mapper->domainToDto($collection), $collection);

        return $this->mapper->dtoToJson($dto);
    }

    public function remove(User $user, string $origin, string $model): bool
    {
        return $this->repository->delete($user, $origin, $model);
    }
}