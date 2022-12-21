/**
 * If the text is longer than the max length minus 3, then return the text trimmed to the max length
 * and add an ellipsis. Otherwise, return the text.
 * @param text - The text to be limited.
 * @param maxLength - The maximum length of the string.
 * @returns a string.
 */
const limitStrLength = (text, maxLength) => {
  if (text.length > maxLength - 3) {
    return `${text.substring(0, maxLength).trimEnd()}...`;
  }

  return text;
};

export default limitStrLength;
