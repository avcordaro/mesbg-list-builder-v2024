import { profileData } from "../../../assets/data.ts";
import { Unit } from "../../../types/mesbg-data.types.ts";

export const COMPOSED_UNIT_MAP = {
  "Bain, Son of Bard": "Bard's Family",
  Tilda: "Bard's Family",
  Sigrid: "Bard's Family",
  Shank: "Shank & Wrot",
  Wrot: "Shank & Wrot",
  "Snow Troll": "Shank & Wrot",
};

export function convertBardsFamilyToSingleRows(dataPoint: Unit[]) {
  const base = {
    army_type: dataPoint[0].army_type,
    profile_origin: dataPoint[0].profile_origin,
    unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
    army_list: dataPoint.map((p) => p.army_list),
    option_mandatory: dataPoint[0].opt_mandatory,
    options: dataPoint
      .flatMap((p) => p.options)
      .filter((o, i, s) => s.findIndex((ot) => ot.name === o.name) === i),
  };
  return [
    {
      ...base,
      name: `Bain, Son of Bard`,
      MWFW: dataPoint.flatMap((p) => p.MWFW),
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Bain, Son of Bard"),
    },
    {
      ...base,
      name: `Sigrid`,
      MWFW: dataPoint.flatMap((p) => p.MWFW),
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Sigrid"),
    },
    {
      ...base,
      name: `Tilda`,
      MWFW: dataPoint.flatMap((p) => p.MWFW),
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Tilda"),
    },
  ];
}

export function convertShankAndWrotToSingleRows(dataPoint: Unit[]) {
  const base = {
    army_type: dataPoint[0].army_type,
    profile_origin: dataPoint[0].profile_origin,
    unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
    army_list: dataPoint.map((p) => p.army_list),
    option_mandatory: dataPoint[0].opt_mandatory,
    options: dataPoint
      .flatMap((p) => p.options)
      .filter((o, i, s) => s.findIndex((ot) => ot.name === o.name) === i),
  };

  return [
    {
      ...base,
      name: `Shank`,
      MWFW: [dataPoint.flatMap((p) => p.MWFW)[0]],
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Shank"),
    },
    {
      ...base,
      name: `Wrot`,
      MWFW: [dataPoint.flatMap((p) => p.MWFW)[1]],
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Wrot"),
    },
    {
      ...base,
      name: `Snow Troll`,
      MWFW: [],
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Snow Troll"),
    },
  ];
}

export function convertSharkeyAndWormToSingleRows(dataPoint: Unit[]) {
  const base = {
    army_type: dataPoint[0].army_type,
    profile_origin: dataPoint[0].profile_origin,
    unit_type: [...new Set(dataPoint.map((p) => p.unit_type))],
    army_list: dataPoint.map((p) => p.army_list),
    option_mandatory: dataPoint[0].opt_mandatory,
    options: dataPoint
      .flatMap((p) => p.options)
      .filter((o, i, s) => s.findIndex((ot) => ot.name === o.name) === i),
  };

  return [
    {
      ...base,
      name: `Sharkey`,
      MWFW: [dataPoint.flatMap((p) => p.MWFW)[0]],
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Sharkey"),
    },
    {
      ...base,
      name: `Worm`,
      MWFW: [dataPoint.flatMap((p) => p.MWFW)[1]],
      profile: profileData[dataPoint[0].profile_origin][
        dataPoint[0].name
      ].additional_stats.find((stat) => stat.name === "Worm"),
    },
  ];
}
