import { Fa1, Fa2, Fa3, Fa4, Fa5, Fa6, Fa7, Fa8, Fa9 } from "react-icons/fa6";
import { GoArchive, GoTrophy } from "react-icons/go";
import { HiOutlineThumbDown, HiOutlineThumbUp } from "react-icons/hi";
import { HiBeaker, HiHeart, HiLightBulb } from "react-icons/hi2";
import { TbCheese } from "react-icons/tb";
import { FactionIcon } from "../faction-icon/FactionIcon.tsx";

export const factionLogos = {
  // Good factions
  "Minas Tirith": <FactionIcon faction="Minas Tirith" />,
  Rohan: <FactionIcon faction="Kingdom of Rohan" />,
  Rivendell: <FactionIcon faction="Rivendell" />,
  Lothlorien: <FactionIcon faction="Lothlorien" />,
  Thranduil: <FactionIcon faction="Halls of Thranduil" />,
  Arnor: <FactionIcon faction="Arnor" />,
  Numenor: <FactionIcon faction="Numenor" />,
  Rangers: <FactionIcon faction="Arathorn's Stand" />,
  "The Iron Hills": <FactionIcon faction="The Iron Hills" />,
  Fellowship: <FactionIcon faction="Breaking of the Fellowship" />,
  Fangorn: <FactionIcon faction="Fangorn" />,
  Eagles: <FactionIcon faction="The Eagles" />,
  // Evil Factions
  Mordor: <FactionIcon faction="Legions of Mordor" />,
  Angmar: <FactionIcon faction="Shadows of Angmar" />,
  Isengard: <FactionIcon faction="Muster of Isengard" />,
  Moria: <FactionIcon faction="Depths of Moria" />,
  Corsairs: <FactionIcon faction="Corsair Fleet" />,
  Harad: <FactionIcon faction="Harad" />,
  "Barad-dur": <FactionIcon faction="Barad-dur" />,
  "Dol Guldur": <FactionIcon faction="Rise of the Necromancer" />,
  Wildman: <FactionIcon faction="Usurpers of Edoras" />,
  Gundabad: <FactionIcon faction="Army of Gundabad" />,
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
