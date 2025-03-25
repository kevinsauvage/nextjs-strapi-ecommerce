export const transformedSettings = (originalObject) => {
  const transformedObject = {};

  Object.keys(originalObject).forEach((key) => {
    transformedObject[key] = originalObject[key] ? 'granted' : 'denied';
  });

  return transformedObject;
};
