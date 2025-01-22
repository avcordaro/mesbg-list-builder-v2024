<?php

namespace MLB\domain\builders;

use MLB\domain\Game;

class GameBuilder
{
    private string $id;
    private string $user_id;
    private string $game_date;
    private ?int $duration;
    private int $points;
    private string $match_result;
    private ?string $scenario_played;
    private mixed $tags;
    private string $armies;
    private int $bows;
    private int $throwing_weapons;
    private string $victory_points;
    private ?string $opponent_armies;
    private ?string $opponent_name;
    private ?string $opponent_victory_points;

    public function setId(string $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function setUserId(string $user_id): self
    {
        $this->user_id = $user_id;
        return $this;
    }

    public function setGameDate(string $game_date): self
    {
        $this->game_date = $game_date;
        return $this;
    }

    public function setDuration(int $duration): self
    {
        $this->duration = $duration;
        return $this;
    }

    public function setPoints(int $points): self
    {
        $this->points = $points;
        return $this;
    }

    public function setMatchResult(string $match_result): self
    {
        $this->match_result = $match_result;
        return $this;
    }

    public function setScenarioPlayed(string $scenario_played): self
    {
        $this->scenario_played = $scenario_played;
        return $this;
    }

    public function setTags(mixed $tags): self
    {
        $this->tags = $tags;
        return $this;
    }

    public function setArmies(string $armies): self
    {
        $this->armies = $armies;
        return $this;
    }

    public function setBows(int $bows): self
    {
        $this->bows = $bows;
        return $this;
    }

    public function setThrowingWeapons(int $throwing_weapons): self
    {
        $this->throwing_weapons = $throwing_weapons;
        return $this;
    }

    public function setVictoryPoints(string $victory_points): self
    {
        $this->victory_points = $victory_points;
        return $this;
    }

    public function setOpponentArmies(string $opponent_armies): self
    {
        $this->opponent_armies = $opponent_armies;
        return $this;
    }

    public function setOpponentName(string $opponent_name): self
    {
        $this->opponent_name = $opponent_name;
        return $this;
    }

    public function setOpponentVictoryPoints(string $opponent_victory_points): self
    {
        $this->opponent_victory_points = $opponent_victory_points;
        return $this;
    }

    public function build(): Game
    {
        return new Game(
            $this->id,
            $this->user_id,
            $this->game_date,
            $this->duration,
            $this->points,
            $this->match_result,
            $this->scenario_played,
            $this->tags,
            $this->armies,
            $this->bows,
            $this->throwing_weapons,
            $this->victory_points,
            $this->opponent_armies,
            $this->opponent_name,
            $this->opponent_victory_points
        );
    }
}
