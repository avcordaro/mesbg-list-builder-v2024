<?php

namespace MLB\domain\builders;

use MLB\domain\Warband;

class WarbandBuilder
{
    private ?int $roster_id = null;
    private string $id;
    private ?string $hero_id = null;
    private ?string $hero_model_id = null;
    private ?string $hero_mwfw = null;
    private ?string $hero_options = null;
    private ?bool $hero_compulsory = null;
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

    public function setRosterId(?int $roster_id): self
    {
        $this->roster_id = $roster_id;
        return $this;
    }

    public function setId(string $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function setHeroId(?string $hero_id): self
    {
        $this->hero_id = $hero_id;
        return $this;
    }

    public function setHeroModelId(?string $hero_model_id): self
    {
        $this->hero_model_id = $hero_model_id;
        return $this;
    }

    public function setHeroMwfw(?string $hero_mwfw): self
    {
        $this->hero_mwfw = $hero_mwfw;
        return $this;
    }

    public function setHeroOptions(?string $hero_options): self
    {
        $this->hero_options = $hero_options;
        return $this;
    }

    public function setHeroCompulsory(?bool $hero_compulsory): self
    {
        $this->hero_compulsory = $hero_compulsory;
        return $this;
    }

    public function setMetaNum(int $meta_num): self
    {
        $this->meta_num = $meta_num;
        return $this;
    }

    public function setMetaPoints(int $meta_points): self
    {
        $this->meta_points = $meta_points;
        return $this;
    }

    public function setMetaUnits(int $meta_units): self
    {
        $this->meta_units = $meta_units;
        return $this;
    }

    public function setMetaHeroes(int $meta_heroes): self
    {
        $this->meta_heroes = $meta_heroes;
        return $this;
    }

    public function setMetaBows(int $meta_bows): self
    {
        $this->meta_bows = $meta_bows;
        return $this;
    }

    public function setMetaThrowingWeapons(int $meta_throwing_weapons): self
    {
        $this->meta_throwing_weapons = $meta_throwing_weapons;
        return $this;
    }

    public function setMetaBowLimit(int $meta_bow_limit): self
    {
        $this->meta_bow_limit = $meta_bow_limit;
        return $this;
    }

    public function setMetaThrowLimit(int $meta_throw_limit): self
    {
        $this->meta_throw_limit = $meta_throw_limit;
        return $this;
    }

    public function setMetaMaxUnits(int $meta_max_units): self
    {
        $this->meta_max_units = $meta_max_units;
        return $this;
    }

    public function setUnits(string $units): self
    {
        $this->units = $units;
        return $this;
    }

    public function build(): Warband
    {
        return new Warband(
            $this->roster_id,
            $this->id,
            $this->hero_id,
            $this->hero_model_id,
            $this->hero_mwfw,
            $this->hero_options,
            $this->hero_compulsory,
            $this->meta_num,
            $this->meta_points,
            $this->meta_units,
            $this->meta_heroes,
            $this->meta_bows,
            $this->meta_throwing_weapons,
            $this->meta_bow_limit,
            $this->meta_throw_limit,
            $this->meta_max_units,
            $this->units
        );
    }
}