<?php

namespace MLB\domain;

class Game
{
    private string $id;
    private ?string $user_id;
    private string $game_date;
    private ?int $duration;
    private int $points;
    private string $match_result;
    private ?string $scenario_played;
    private string $tags;
    private string $armies;
    private int $bows;
    private int $throwing_weapons;
    private string $victory_points;
    private ?string $opponent_armies;
    private ?string $opponent_name;
    private ?string $opponent_victory_points;

    public function __construct(
        string $id,
        ?string $user_id,
        string $game_date,
        ?int    $duration,
        int    $points,
        string $match_result,
        ?string $scenario_played,
        string  $tags,
        string $armies,
        int    $bows,
        int    $throwing_weapons,
        string $victory_points,
        ?string $opponent_armies,
        ?string $opponent_name,
        ?string $opponent_victory_points
    )
    {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->game_date = $game_date;
        $this->duration = $duration;
        $this->points = $points;
        $this->match_result = $match_result;
        $this->scenario_played = $scenario_played;
        $this->tags = $tags;
        $this->armies = $armies;
        $this->bows = $bows;
        $this->throwing_weapons = $throwing_weapons;
        $this->victory_points = $victory_points;
        $this->opponent_armies = $opponent_armies;
        $this->opponent_name = $opponent_name;
        $this->opponent_victory_points = $opponent_victory_points;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getUserId(): ?string
    {
        return $this->user_id;
    }

    public function getGameDate(): string
    {
        return $this->game_date;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function getPoints(): int
    {
        return $this->points;
    }

    public function getMatchResult(): string
    {
        return $this->match_result;
    }

    public function getScenarioPlayed(): ?string
    {
        return $this->scenario_played;
    }

    public function getTags(): string
    {
        return $this->tags;
    }

    public function getArmies(): string
    {
        return $this->armies;
    }

    public function getBows(): int
    {
        return $this->bows;
    }

    public function getThrowingWeapons(): int
    {
        return $this->throwing_weapons;
    }

    public function getVictoryPoints(): string
    {
        return $this->victory_points;
    }

    public function getOpponentArmies(): ?string
    {
        return $this->opponent_armies;
    }

    public function getOpponentName(): ?string
    {
        return $this->opponent_name;
    }

    public function getOpponentVictoryPoints(): ?string
    {
        return $this->opponent_victory_points;
    }
}