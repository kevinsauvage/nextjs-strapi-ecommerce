export const isOptionSelected = (optionName, optionValue, selectedProductOption) => {
  if (selectedProductOption?.length) {
    return selectedProductOption?.find(
      (option) => option.name === optionName && option.value === optionValue
    );
  }
  return false;
};

export const getDifference = (array1, array2) => {
  const difference = array1?.filter(
    (object1) =>
      !array2?.some((object2) => object1.name === object2.name && object1.value === object2.value)
  );

  return !!difference?.length;
};

export const isOptionOutOfStock = (optionName, optionValue, variants, selectedProductOption) => {
  const dif = variants?.filter((variant) => {
    const selection = selectedProductOption.map((option) => {
      if (option.name === optionName) return { name: optionName, value: optionValue };
      return option;
    });

    return !getDifference(variant.selectedOptions, selection);
  }, {});
  return !dif?.length;
};

const colors = new Set([
  'black',
  'blue',
  'brown',
  'gray',
  'green',
  'orange',
  'pink',
  'purple',
  'red',
  'white',
  'yellow',
  'gold',
  'silver',
  'bronze',
  'beige',
  'maroon',
  'olive',
  'navy',
  'turquoise',
  'violet',
  'indigo',
  'magenta',
  'crimson',
  'teal',
  'aquamarine',
  'chartreuse',
  'coral',
  'fuchsia',
  'khaki',
  'lavender',
  'lime',
  'mustard',
  'peach',
  'salmon',
  'sienna',
]);

export const extractUniqueColorNames = (data) => {
  const colorMap = new Map();

  data.forEach((item) => {
    const color = item.label
      .toLowerCase()
      .split(' ')
      .filter((word) => colors.has(word));
    if (color.length > 0) {
      colorMap.set(color[0], { ...item, label: color[0] });
    }
  });

  return [...colorMap.values()];
};
