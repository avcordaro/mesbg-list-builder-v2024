<?php

namespace MLB\domain;

class Collection
{
    private int $id;
    private string $user_id;
    private string $origin;
    private string $model;
    private mixed $collection;

    public function __construct(
        int    $id,
        string $user_id,
        string $origin,
        string $model,
        mixed  $collection
    )
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->origin = $origin;
        $this->model = $model;
        $this->collection = $collection;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUserId(): string
    {
        return $this->user_id;
    }

    public function getOrigin(): string
    {
        return $this->origin;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function getCollection(): mixed
    {
        return $this->collection;
    }
}