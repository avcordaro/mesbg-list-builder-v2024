<?php

namespace MLB\matches;

use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerBuilder;
use MLB\domain\builders\GameBuilder;
use MLB\domain\Game;
use MLB\matches\dto\GameDTO;

class GameMapper
{
    private Serializer $serializer;

    public function __construct()
    {
        $this->serializer = SerializerBuilder::create()->build();
    }

    public function convertPayloadToDto(object $payload): GameDTO
    {
        return $this->serializer->deserialize($payload, GameDTO::class, 'json');
    }

    public function convertDtoToJson(mixed $dto): string
    {
        return $this->serializer->serialize($dto, "json");
    }

    public function dtoToDomain(GameDTO $dto): Game
    {
        return (new GameBuilder())
            ->setId($dto->id)
            ->setGameDate($dto->gameDate)
            ->setDuration($dto->duration)
            ->setPoints($dto->points)
            ->setMatchResult($dto->matchResult)
            ->setScenarioPlayed($dto->scenarioPlayed)
            ->setTags(json_encode($dto->tags))
            ->setArmies($dto->armies)
            ->setBows($dto->bows)
            ->setThrowingWeapons($dto->throwingWeapons)
            ->setVictoryPoints($dto->victoryPoints)
            ->setOpponentArmies($dto->opponentArmies)
            ->setOpponentName($dto->opponentName)
            ->setOpponentVictoryPoints($dto->opponentVictoryPoints)
            ->build();
    }

    public function domainToDto(Game $game): GameDTO
    {
        $dto = new GameDTO();

        $dto->id = $game->getId();
        $dto->gameDate = $game->getGameDate();
        $dto->duration = $game->getDuration();
        $dto->points = $game->getPoints();
        $dto->matchResult = $game->getMatchResult();
        $dto->tags = json_decode($game->getTags());
        $dto->armies = $game->getArmies();
        $dto->bows = $game->getBows();
        $dto->throwingWeapons = $game->getThrowingWeapons();
        $dto->opponentArmies = $game->getOpponentArmies();
        $dto->opponentName = $game->getOpponentName();
        $dto->opponentVictoryPoints = $game->getOpponentVictoryPoints();

        return $dto;
    }

    public function assocArrayToDomain(array $rows): array
    {
        $games = [];
        foreach ($rows as $row) {
            $games[$row["id"]] = (new GameBuilder())
                ->setId($row["id"])
                ->setGameDate($row["game_date"])
                ->setDuration($row["duration"])
                ->setPoints($row["points"])
                ->setMatchResult($row["match_result"])
                ->setTags($row["tags"])
                ->setArmies($row["armies"])
                ->setBows($row["bows"])
                ->setThrowingWeapons($row["throwing_weapons"])
                ->setVictoryPoints($row["victory_points"])
                ->setOpponentArmies($row["opponent_armies"])
                ->setOpponentName($row["opponent_name"])
                ->setOpponentVictoryPoints($row["opponent_victory_points"])
                ->build();
        }
        return array_values($games);
    }
}