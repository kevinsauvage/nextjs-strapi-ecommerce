// eslint-disable-next-line import/prefer-default-export
export const numberOfDifferences = (array1 = [], array2 = []) => {
  const diff1 = array1.filter(
    (object1) => !array2.some((object2) => object2.input === object1.input)
  );

  const diff2 = array2.filter(
    (object2) => !array1.some((object1) => object1.input === object2.input)
  );

  return [...diff1, ...diff2].length;
};
