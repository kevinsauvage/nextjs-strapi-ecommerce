// eslint-disable-next-line import/prefer-default-export
export const capitalizeFirstLetter = (string_) => {
  if (!string_?.trim()) return '';
  return string_.charAt(0).toUpperCase() + string_.slice(1);
};
