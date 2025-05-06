<?php

namespace MLB\rosters\dto;

use JMS\Serializer\Annotation as Serializer;

class WarbandDTO
{
    #[Serializer\SerializedName("id")]
    public string $id;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("hero")]
    public ?HeroDTO $hero = null;

    #[Serializer\SerializedName("units")]
    #[Serializer\Type("array<MLB\\rosters\dto\UnitDTO>>")]
    public array $units;

    #[Serializer\SerializedName("meta")]
    public WarbandMetaDTO $meta;
}
