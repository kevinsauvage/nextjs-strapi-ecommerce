/* eslint-disable no-plusplus */
export function isArrayDifferent(arr1, arr2) {
  let count = 0;
  if (arr1.length !== arr2.length) {
    count = Math.abs(arr1.length - arr2.length);
  }
  const arr1Map = arr1.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  for (let i = 0; i < arr2.length; i++) {
    if (!arr1Map[arr2[i].id] || JSON.stringify(arr1Map[arr2[i].id]) !== JSON.stringify(arr2[i])) {
      count++;
    }
  }
  return count;
}

export function numberOfDifferences(arr1, arr2) {
  return (
    arr1.filter((item) => !arr2.includes(item)).length + arr2.filter((item) => !arr1.includes(item)).length
  );
}
