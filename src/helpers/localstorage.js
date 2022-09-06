const localStorageHelper = {
  load(key) {
    const stored = localStorage.getItem(key);
    return stored == null ? undefined : JSON.parse(stored);
  },
  store(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

export default localStorageHelper;
