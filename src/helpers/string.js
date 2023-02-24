// eslint-disable-next-line import/prefer-default-export
export function capitalizeFirstLetter(str) {
  if (!str?.trim()) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
