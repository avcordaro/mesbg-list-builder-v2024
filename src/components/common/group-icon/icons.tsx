import { Fa1, Fa2, Fa3, Fa4, Fa5, Fa6, Fa7, Fa8, Fa9 } from "react-icons/fa6";
import { GoArchive, GoTrophy } from "react-icons/go";
import { HiOutlineThumbDown, HiOutlineThumbUp } from "react-icons/hi";
import { HiBeaker, HiHeart, HiLightBulb } from "react-icons/hi2";
import { TbCheese } from "react-icons/tb";
import { FactionLogo } from "../images/FactionLogo.tsx";

export const factionLogos = {
  // Good factions
  "Minas Tirith": <FactionLogo faction="Minas Tirith" />,
  Rohan: <FactionLogo faction="Kingdom of Rohan" />,
  Rivendell: <FactionLogo faction="Rivendell" />,
  Lothlorien: <FactionLogo faction="Lothlorien" />,
  Thranduil: <FactionLogo faction="Halls of Thranduil" />,
  Arnor: <FactionLogo faction="Arnor" />,
  Numenor: <FactionLogo faction="Numenor" />,
  Rangers: <FactionLogo faction={"Arathorn's Stand"} />,
  "The Iron Hills": <FactionLogo faction="The Iron Hills" />,
  Fellowship: <FactionLogo faction="Breaking of the Fellowship" />,
  Fangorn: <FactionLogo faction="Fangorn" />,
  Eagles: <FactionLogo faction="The Eagles" />,
  // Evil Factions
  Mordor: <FactionLogo faction="Legions of Mordor" />,
  Angmar: <FactionLogo faction="Shadows of Angmar" />,
  Isengard: <FactionLogo faction="Muster of Isengard" />,
  Moria: <FactionLogo faction="Depths of Moria" />,
  Corsairs: <FactionLogo faction="Corsair Fleet" />,
  Harad: <FactionLogo faction="Harad" />,
  "Barad-dur": <FactionLogo faction="Barad-dur" />,
  Necromancer: <FactionLogo faction="Rise of the Necromancer" />,
};

export const gameIcons = {
  Experiment: <HiBeaker />,
  Ideas: <HiLightBulb />,
  Favorites: <HiHeart />,
  Dislike: <HiOutlineThumbDown />,
  Like: <HiOutlineThumbUp />,
  Cheese: <TbCheese />,
  Tournament: <GoTrophy />,
  Archive: <GoArchive />,
};

export const numberIcons = {
  "Number 1": <Fa1 />,
  "Number 2": <Fa2 />,
  "Number 3": <Fa3 />,
  "Number 4": <Fa4 />,
  "Number 5": <Fa5 />,
  "Number 6": <Fa6 />,
  "Number 7": <Fa7 />,
  "Number 8": <Fa8 />,
  "Number 9": <Fa9 />,
};

export const icons = {
  ...factionLogos,
  ...gameIcons,
  ...numberIcons,
};
