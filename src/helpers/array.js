// eslint-disable-next-line import/prefer-default-export
export function numberOfDifferences(arr1, arr2) {
  return (
    arr1.filter((item) => !arr2.includes(item)).length + arr2.filter((item) => !arr1.includes(item)).length
  );
}
