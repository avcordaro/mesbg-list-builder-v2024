<?php

namespace MLB\rosters;

use JMS\Serializer\Serializer;
use JMS\Serializer\SerializerBuilder;
use MLB\domain\builders\RosterBuilder;
use MLB\domain\builders\WarbandBuilder;
use MLB\domain\Roster;
use MLB\rosters\dto\RosterDTO;
use MLB\rosters\dto\WarbandDTO;

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
}