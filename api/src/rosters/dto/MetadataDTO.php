<?php

namespace MLB\rosters\dto;

use JMS\Serializer\Annotation as Serializer;

class MetadataDTO
{

    #[Serializer\SerializedName("syncId")]
    #[Serializer\SkipWhenEmpty]
    public ?string $dbId = null;

    #[Serializer\SerializedName("owner")]
    #[Serializer\SkipWhenEmpty]
    public ?string $userId = null;

    #[Serializer\SerializedName("leader")]
    public string $leader = "";

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("siegeRoster")]
    public ?bool $siegeRoster = null;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("siegeRole")]
    public ?string $siegeRole = null;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("maxPoints")]
    public ?int $maxPoints = null;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("tttSpecialRules")]
    #[Serializer\Type("array<string>")]
    public ?array $tttSpecialRules = null;
}