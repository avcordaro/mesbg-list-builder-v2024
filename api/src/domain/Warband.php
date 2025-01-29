<?php

namespace MLB\domain;

class Warband
{
    private ?int $roster_id;
    private string $id;
    private ?string $hero_id;
    private ?string $hero_model_id;
    private ?string $hero_mwfw;
    private ?string $hero_options;
    private ?bool $hero_compulsory;
    private int $meta_num;
    private int $meta_points;
    private int $meta_units;
    private int $meta_heroes;
    private int $meta_bows;
    private int $meta_throwing_weapons;
    private int $meta_bow_limit;
    private int $meta_throw_limit;
    private int $meta_max_units;
    private string $units;

    public function __construct(
        ?int     $roster_id,
        string  $id,
        ?string $hero_id,
        ?string $hero_model_id,
        ?string $hero_mwfw,
        ?string $hero_options,
        ?bool   $hero_compulsory,
        int     $meta_num,
        int     $meta_points,
        int     $meta_units,
        int     $meta_heroes,
        int     $meta_bows,
        int     $meta_throwing_weapons,
        int     $meta_bow_limit,
        int     $meta_throw_limit,
        int     $meta_max_units,
        string  $units
    )
    {
        $this->roster_id = $roster_id;
        $this->id = $id;
        $this->hero_id = $hero_id;
        $this->hero_model_id = $hero_model_id;
        $this->hero_mwfw = $hero_mwfw;
        $this->hero_options = $hero_options;
        $this->hero_compulsory = $hero_compulsory;
        $this->meta_num = $meta_num;
        $this->meta_points = $meta_points;
        $this->meta_units = $meta_units;
        $this->meta_heroes = $meta_heroes;
        $this->meta_bows = $meta_bows;
        $this->meta_throwing_weapons = $meta_throwing_weapons;
        $this->meta_bow_limit = $meta_bow_limit;
        $this->meta_throw_limit = $meta_throw_limit;
        $this->meta_max_units = $meta_max_units;
        $this->units = $units;
    }

    public function getRosterId(): ?int
    {
        return $this->roster_id;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getHeroId(): ?string
    {
        return $this->hero_id;
    }

    public function getHeroModelId(): ?string
    {
        return $this->hero_model_id;
    }

    public function getHeroMwfw(): ?string
    {
        return $this->hero_mwfw;
    }

    public function getHeroOptions(): ?string
    {
        return $this->hero_options;
    }

    public function getHeroCompulsory(): ?bool
    {
        return $this->hero_compulsory;
    }

    public function getMetaNum(): int
    {
        return $this->meta_num;
    }

    public function getMetaPoints(): int
    {
        return $this->meta_points;
    }

    public function getMetaUnits(): int
    {
        return $this->meta_units;
    }

    public function getMetaHeroes(): int
    {
        return $this->meta_heroes;
    }

    public function getMetaBows(): int
    {
        return $this->meta_bows;
    }

    public function getMetaThrowingWeapons(): int
    {
        return $this->meta_throwing_weapons;
    }

    public function getMetaBowLimit(): int
    {
        return $this->meta_bow_limit;
    }

    public function getMetaThrowLimit(): int
    {
        return $this->meta_throw_limit;
    }

    public function getMetaMaxUnits(): int
    {
        return $this->meta_max_units;
    }

    public function getUnits(): string
    {
        return $this->units;
    }
}