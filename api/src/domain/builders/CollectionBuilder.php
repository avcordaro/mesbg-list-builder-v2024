<?php

namespace MLB\domain\builders;

use MLB\domain\Collection;

class CollectionBuilder
{
    private ?int $id = null;
    private ?string $user_id = null;
    private string $origin;
    private string $model;
    private mixed $collection;

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function setUserId(?string $user_id): self
    {
        $this->user_id = $user_id;
        return $this;
    }

    public function setOrigin(string $origin): self
    {
        $this->origin = $origin;
        return $this;
    }

    public function setModel(string $model): self
    {
        $this->model = $model;
        return $this;
    }

    public function setCollection(mixed $collection): self
    {
        $this->collection = $collection;
        return $this;
    }

    public function build(): Collection
    {
        return new Collection(
            $this->id,
            $this->user_id,
            $this->origin,
            $this->model,
            $this->collection
        );
    }
}
