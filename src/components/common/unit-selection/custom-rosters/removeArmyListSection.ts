export function removeArmyListSection(item: string) {
  return item.replace(/\[[^\]]*\]\s*/g, "");
}
