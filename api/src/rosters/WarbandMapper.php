<?php

namespace MLB\rosters;

use MLB\domain\builders\WarbandBuilder;
use MLB\domain\Warband;
use MLB\rosters\dto\HeroDTO;
use MLB\rosters\dto\WarbandDTO;
use MLB\rosters\dto\WarbandMetaDTO;

class WarbandMapper
{
    public function dtoToDomain(array $dto): array
    {
        return array_map(function (WarbandDTO $warbandDTO) {
            $builder = new WarbandBuilder();
            $builder
                ->setId($warbandDTO->id)
                ->setMetaNum($warbandDTO->meta->num)
                ->setMetaPoints($warbandDTO->meta->points)
                ->setMetaMaxUnits($warbandDTO->meta->maxUnits)
                ->setMetaUnits($warbandDTO->meta->units)
                ->setMetaHeroes($warbandDTO->meta->heroes)
                ->setMetaBows($warbandDTO->meta->bows)
                ->setMetaBowLimit($warbandDTO->meta->bowLimit)
                ->setMetaThrowingWeapons($warbandDTO->meta->throwingWeapons)
                ->setMetaThrowLimit($warbandDTO->meta->throwLimit)
                ->setUnits(json_encode($warbandDTO->units));

            if (!is_null($warbandDTO->hero)) {
                $builder
                    ->setHeroId($warbandDTO->hero->id)
                    ->setHeroModelId($warbandDTO->hero->modelId)
                    ->setHeroMwfw(json_encode($warbandDTO->hero->MWFW))
                    ->setHeroOptions(json_encode($warbandDTO->hero->options))
                    ->setHeroCompulsory($warbandDTO->hero->compulsory);
            }

            return $builder->build();
        }, $dto);
    }

    public function domainToDto(array $warbands): array
    {
        return array_map(function (Warband $warband) {
            $dto = new WarbandDTO();
            $dto->id = $warband->getId();
            $dto->units = json_decode($warband->getUnits());

            $metadata = new WarbandMetaDTO();
            $metadata->num = $warband->getMetaNum();
            $metadata->points = $warband->getMetaPoints();
            $metadata->maxUnits = $warband->getMetaMaxUnits();
            $metadata->units = $warband->getMetaUnits();
            $metadata->heroes = $warband->getMetaHeroes();
            $metadata->bows = $warband->getMetaBows();
            $metadata->bowLimit = $warband->getMetaBowLimit();
            $metadata->throwingWeapons = $warband->getMetaThrowingWeapons();
            $metadata->throwLimit = $warband->getMetaThrowLimit();
            $dto->meta = $metadata;

            if (!is_null($warband->getHeroId())) {
                $hero = new HeroDTO();
                $hero->id = $warband->getHeroId();
                $hero->modelId = $warband->getHeroModelId();
                $hero->options = json_decode($warband->getHeroOptions());
                $hero->MWFW = json_decode($warband->getHeroMwfw());
                $hero->compulsory = $warband->getHeroCompulsory();
                $dto->hero = $hero;
            }

            return $dto;
        }, $warbands);
    }
}