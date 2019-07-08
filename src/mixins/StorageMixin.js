const storage = {};
export default {
  methods: {
    addStorageItem(key, data) {
      storage[key] = data;
    },
    getStorageItem(key) {
      return storage[key];
    },
    removeStorageItem(key) {
      storage[key] = undefined;
    }
  }
};
