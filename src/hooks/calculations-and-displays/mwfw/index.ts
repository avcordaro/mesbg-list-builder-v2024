import * as Asfaloth from "./asfaloth.ts";
import * as Azog from "./azog-white-warg.ts";
import * as GandalfTheWhite from "./gandalf-the-white.ts";
import * as Dragons from "./tough-hide-dragon.ts";
import * as Treebeard from "./treebeard.ts";
import * as WarMumakCommanders from "./war-mumak-commanders.ts";

export default [
  GandalfTheWhite.handler,
  Treebeard.handler,
  WarMumakCommanders.handler,
  Azog.handler,
  Asfaloth.handler,
  Dragons.handler,
];

export const handledModels = [
  ...GandalfTheWhite.handledModels,
  ...Treebeard.handledModels,
  ...WarMumakCommanders.handledModels,
  ...Azog.handledModels,
  ...Asfaloth.handledModels,
  ...Dragons.handledModels,
];
