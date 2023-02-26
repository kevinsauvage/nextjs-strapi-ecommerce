// eslint-disable-next-line import/prefer-default-export
export function numberOfDifferences(arr1, arr2) {
  const diff1 = arr1.filter((obj1) => !arr2.some((obj2) => obj2.input === obj1.input));

  const diff2 = arr2.filter((obj2) => !arr1.some((obj1) => obj1.input === obj2.input));

  return diff1.concat(diff2).length;
}
