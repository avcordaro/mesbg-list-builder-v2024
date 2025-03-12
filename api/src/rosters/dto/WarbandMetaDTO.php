<?php

namespace MLB\rosters\dto;

use JMS\Serializer\Annotation as Serializer;

class WarbandMetaDTO
{
    #[Serializer\SerializedName("num")]
    public int $num;

    #[Serializer\SerializedName("points")]
    public int $points;

    #[Serializer\SerializedName("units")]
    public int $units;

    #[Serializer\SerializedName("heroes")]
    public int $heroes;

    #[Serializer\SerializedName("bows")]
    public int $bows;

    #[Serializer\SerializedName("throwingWeapons")]
    public int $throwingWeapons;

    #[Serializer\SerializedName("bowLimit")]
    public int $bowLimit;

    #[Serializer\SerializedName("throwLimit")]
    public int $throwLimit;

    #[Serializer\SerializedName("maxUnits")]
    public int $maxUnits;
}
