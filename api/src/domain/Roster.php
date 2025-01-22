<?php

namespace MLB\domain;

class Roster
{
    private int $id;
    private string $user_id;
    private string $slug;
    private string $version;
    private ?string $roster_group;
    private string $name;
    private string $army_list;
    private string $edition;
    private string $meta_leader;
    private ?bool $meta_siege_roster;
    private ?string $meta_siege_role;
    private ?int $meta_max_points;
    private ?string $meta_ttt_special_upgrades;

    public function __construct(
        int     $id,
        string  $user_id,
        string  $slug,
        string  $version,
        ?string $roster_group,
        string  $name,
        string  $army_list,
        string  $edition,
        string  $meta_leader,
        ?bool   $meta_siege_roster,
        ?string $meta_siege_role,
        ?int    $meta_max_points,
        ?string $meta_ttt_special_upgrades
    )
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->slug = $slug;
        $this->version = $version;
        $this->roster_group = $roster_group;
        $this->name = $name;
        $this->army_list = $army_list;
        $this->edition = $edition;
        $this->meta_leader = $meta_leader;
        $this->meta_siege_roster = $meta_siege_roster;
        $this->meta_siege_role = $meta_siege_role;
        $this->meta_max_points = $meta_max_points;
        $this->meta_ttt_special_upgrades = $meta_ttt_special_upgrades;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUserId(): string
    {
        return $this->user_id;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getVersion(): string
    {
        return $this->version;
    }

    public function getRosterGroup(): ?string
    {
        return $this->roster_group;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getArmyList(): string
    {
        return $this->army_list;
    }

    public function getEdition(): string
    {
        return $this->edition;
    }

    public function getMetaLeader(): string
    {
        return $this->meta_leader;
    }

    public function getMetaSiegeRoster(): ?bool
    {
        return $this->meta_siege_roster;
    }

    public function getMetaSiegeRole(): ?string
    {
        return $this->meta_siege_role;
    }

    public function getMetaMaxPoints(): ?int
    {
        return $this->meta_max_points;
    }

    public function getMetaTttSpecialUpgrades(): ?string
    {
        return $this->meta_ttt_special_upgrades;
    }
}