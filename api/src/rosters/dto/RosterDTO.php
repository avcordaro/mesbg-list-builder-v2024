<?php

namespace MLB\rosters\dto;

use JMS\Serializer\Annotation as Serializer;

class RosterDTO
{
    #[Serializer\SerializedName("metadata")]
    public MetadataDTO $metadata;

    #[Serializer\SerializedName("warbands")]
    #[Serializer\Type("array<MLB\\rosters\dto\WarbandDTO>")]
    public array $warbands;

    #[Serializer\SerializedName("id")]
    public string $id;

    #[Serializer\SerializedName("version")]
    public string $version;

    #[Serializer\SerializedName("name")]
    public string $name;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("group")]
    public ?string $group = null;

    #[Serializer\SerializedName("armyList")]
    public string $armyList;

    #[Serializer\SerializedName("edition")]
    public string $edition;
}
