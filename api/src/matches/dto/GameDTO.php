<?php

namespace MLB\matches\dto;

use JMS\Serializer\Annotation as Serializer;

class GameDTO
{
    #[Serializer\SerializedName("id")]
    public string $id;

    #[Serializer\SerializedName("userId")]
    #[Serializer\SkipWhenEmpty]
    public ?string $userId = null;

    #[Serializer\SerializedName("gameDate")]
    public string $gameDate;

    #[Serializer\SerializedName("duration")]
    #[Serializer\SkipWhenEmpty]
    public ?int $duration;

    #[Serializer\SerializedName("points")]
    public int $points;

    #[Serializer\SerializedName("result")]
    public string $matchResult;

    #[Serializer\SerializedName("scenarioPlayed")]
    #[Serializer\SkipWhenEmpty]
    public ?string $scenarioPlayed = null;

    #[Serializer\SerializedName("tags")]
    #[Serializer\Type("array<string>")]
    public array $tags;

    #[Serializer\SerializedName("armies")]
    public string $armies;

    #[Serializer\SerializedName("bows")]
    public int $bows;

    #[Serializer\SerializedName("throwingWeapons")]
    public int $throwingWeapons;

    #[Serializer\SerializedName("victoryPoints")]
    public string $victoryPoints;

    #[Serializer\SerializedName("opponentArmies")]
    #[Serializer\SkipWhenEmpty]
    public ?string $opponentArmies = null;

    #[Serializer\SerializedName("opponentName")]
    #[Serializer\SkipWhenEmpty]
    public ?string $opponentName = null;

    #[Serializer\SerializedName("opponentVictoryPoints")]
    #[Serializer\SkipWhenEmpty]
    public ?string $opponentVictoryPoints = null;
}