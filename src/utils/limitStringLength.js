const limitStrLength = (text, maxLength) => {
  if (text.length > maxLength - 3) {
    return `${text.substring(0, maxLength).trimEnd()}...`;
  }

  return text;
};

export default limitStrLength;
