<?php

namespace MLB\collection;

use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerBuilder;
use MLB\collection\dto\CollectionDTO;
use MLB\collection\dto\CollectionEntryDTO;
use MLB\domain\builders\CollectionBuilder;
use MLB\domain\Collection;

class CollectionMapper
{
    private Serializer $serializer;

    public function __construct()
    {
        $this->serializer = SerializerBuilder::create()->build();
    }

    public function dtoToJson(mixed $dto): string
    {
        return $this->serializer->serialize($dto, 'json');
    }

    public function createDto($userId, $origin, $model, $collection): CollectionDTO
    {
        $dto = new CollectionDTO();
        $dto->userId = $userId;
        $dto->origin = $origin;
        $dto->model = $model;
        $dto->collection = $this->serializer->deserialize($collection, "array<MLB\collection\dto\CollectionEntryDTO>", "json");

        return $dto;
    }

    public function dtoToDomain(CollectionDTO $dto): Collection
    {
        return (new CollectionBuilder())
            ->setUserId($dto->userId)
            ->setOrigin($dto->origin)
            ->setModel($dto->model)
            ->setCollection(json_encode($dto->collection))
            ->build();
    }

    public function domainToDto(Collection $collection): CollectionDTO
    {
        $dto = new CollectionDTO();
        $dto->origin = $collection->getOrigin();
        $dto->model = $collection->getModel();
        $dto->collection = json_decode($collection->getCollection());
        return $dto;
    }

    public function assocArrayToDomain(array $rows): array
    {
        $collection = [];
        foreach ($rows as $row) {
            $collection[$row["id"]] = (new CollectionBuilder())
                ->setId($row["id"])
                ->setUserId($row["user_id"])
                ->setOrigin($row["origin"])
                ->setModel($row["model"])
                ->setCollection($row["collection"])
                ->build();
        }

        return array_values($collection);
    }
}