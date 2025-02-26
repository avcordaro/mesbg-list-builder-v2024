export const arraysIntersect = (arr1, arr2) => {
  const set1 = new Set(arr1);
  return arr2.some((item) => set1.has(item));
};

export function moveItem<ITEM_TYPE>(
  array: ITEM_TYPE[],
  fromIndex: number,
  toIndex: number,
): ITEM_TYPE[] {
  // make a shallow copy as to not mutate the original outside the state setters
  const newArray = [...array];

  const [item] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, item);

  return newArray;
}

export function moveItemBetweenLists<ITEM_TYPE>(
  array1: ITEM_TYPE[],
  fromIndex: number,
  array2: ITEM_TYPE[],
  toIndex: number,
): [ITEM_TYPE[], ITEM_TYPE[]] {
  // Create shallow copies of the input arrays as to not mutate the originals
  const newArray1 = [...array1];
  const newArray2 = [...array2];

  const [item] = newArray1.splice(fromIndex, 1);
  newArray2.splice(toIndex, 0, item);

  return [newArray1, newArray2];
}

export function groupBy<ITEM_TYPE>(
  array: ITEM_TYPE[],
  key: string,
): Record<string, ITEM_TYPE[]> {
  return array.reduce((result, currentItem) => {
    // Create a new group if it doesn't exist
    (result[currentItem[key]] = result[currentItem[key]] || []).push(
      currentItem,
    );
    return result;
  }, {});
}

export function arraysMatch<ITEM_TYPE>(a: ITEM_TYPE[], c: ITEM_TYPE[]) {
  return a.length === c.length && a.every((o) => c.includes(o));
}
