<?php

namespace MLB\collection\dto;

class CollectionDTO
{
    public ?int $id = null;
    public ?string $userId = null;
    public string $origin;
    public string $model;
    public array $collection;
}