// eslint-disable-next-line import/prefer-default-export
export const capitalizeFirstLetter = (str) => {
  if (!str?.trim()) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
