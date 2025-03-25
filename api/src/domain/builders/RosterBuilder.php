<?php

namespace MLB\domain\builders;

use MLB\domain\Roster;

class RosterBuilder
{
    private ?int $id = null;
    private ?string $user_id = null;
    private string $slug;
    private string $version;
    private ?string $roster_group = null;
    private string $name;
    private string $army_list;
    private string $edition;
    private string $meta_leader;
    private ?bool $meta_siege_roster = null;
    private ?string $meta_siege_role = null;
    private ?int $meta_max_points = null;
    private ?string $meta_ttt_special_upgrades = null;

    public function setId(?int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function setUserId(?string $user_id): self
    {
        $this->user_id = $user_id;
        return $this;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }

    public function setVersion(string $version): self
    {
        $this->version = $version;
        return $this;
    }

    public function setRosterGroup(?string $roster_group): self
    {
        $this->roster_group = $roster_group;
        return $this;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function setArmyList(string $army_list): self
    {
        $this->army_list = $army_list;
        return $this;
    }

    public function setEdition(string $edition): self
    {
        $this->edition = $edition;
        return $this;
    }

    public function setMetaLeader(string $meta_leader): self
    {
        $this->meta_leader = $meta_leader;
        return $this;
    }

    public function setMetaSiegeRoster(?bool $meta_siege_roster): self
    {
        $this->meta_siege_roster = $meta_siege_roster;
        return $this;
    }

    public function setMetaSiegeRole(?string $meta_siege_role): self
    {
        $this->meta_siege_role = $meta_siege_role;
        return $this;
    }

    public function setMetaMaxPoints(?int $meta_max_points): self
    {
        $this->meta_max_points = $meta_max_points;
        return $this;
    }

    public function setMetaTttSpecialUpgrades(?string $meta_ttt_special_upgrades): self
    {
        $this->meta_ttt_special_upgrades = $meta_ttt_special_upgrades;
        return $this;
    }

    public function build(): Roster
    {
        return new Roster(
            $this->id,
            $this->user_id,
            $this->slug,
            $this->version,
            $this->roster_group,
            $this->name,
            $this->army_list,
            $this->edition,
            $this->meta_leader,
            $this->meta_siege_roster,
            $this->meta_siege_role,
            $this->meta_max_points,
            $this->meta_ttt_special_upgrades
        );
    }

}