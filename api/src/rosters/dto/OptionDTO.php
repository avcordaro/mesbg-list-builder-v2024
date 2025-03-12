<?php

namespace MLB\rosters\dto;

use JMS\Serializer\Annotation as Serializer;

class OptionDTO
{
    #[Serializer\SerializedName("id")]
    public string $id;

    #[Serializer\SerializedName("name")]
    public string $name;

    #[Serializer\SerializedName("points")]
    public int $points;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("type")]
    public ?string $type = null;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("mount_name")]
    public ?string $mountName = null;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("passengers")]
    public ?int $passengers = null;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("selectable")]
    public ?bool $selectable = null;

    #[Serializer\SerializedName("quantity")]
    public int $quantity = 0;
}
