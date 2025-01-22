<?php

namespace MLB\rosters\dto;

use JMS\Serializer\Annotation as Serializer;

class HeroDTO
{
    #[Serializer\SerializedName("id")]
    public string $id;

    #[Serializer\SerializedName("model_id")]
    public string $modelId;

    #[Serializer\SerializedName("MWFW")]
    #[Serializer\Type("array<array<string>>")]
    public array $MWFW;

    #[Serializer\SerializedName("options")]
    #[Serializer\Type("array<MLB\\rosters\dto\OptionDTO>>")]
    public array $options;

    #[Serializer\SkipWhenEmpty]
    #[Serializer\SerializedName("compulsory")]
    public ?bool $compulsory = null;
}
