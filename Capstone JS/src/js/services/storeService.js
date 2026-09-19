import axios from "axios";
import Store from "../models/Store.js";
import { defaultStores } from "../data.js";
import { createId, readStorage, writeStorage } from "../utils/storage.js";

const STORAGE_KEY = "tinStudioStores";
const API_URL = import.meta.env.VITE_STORE_API_URL?.trim();

function localStores() {
  const stores = readStorage(STORAGE_KEY, defaultStores);
  writeStorage(STORAGE_KEY, stores);
  return stores.map((item) => new Store(item));
}

export const storeService = {
  async getAll() {
    if (API_URL) return (await axios.get(API_URL)).data.map((item) => new Store(item));
    return localStores();
  },
  async getById(id) {
    if (API_URL) return new Store((await axios.get(`${API_URL}/${id}`)).data);
    return localStores().find((item) => item.id === String(id));
  },
  async create(payload) {
    if (API_URL) return new Store((await axios.post(API_URL, payload)).data);
    const store = new Store({ ...payload, id: createId("s") });
    writeStorage(STORAGE_KEY, [...localStores(), store]);
    return store;
  },
  async update(id, payload) {
    if (API_URL) return new Store((await axios.put(`${API_URL}/${id}`, payload)).data);
    const store = new Store({ ...payload, id });
    writeStorage(STORAGE_KEY, localStores().map((item) => item.id === String(id) ? store : item));
    return store;
  },
  async remove(id) {
    if (API_URL) await axios.delete(`${API_URL}/${id}`);
    else writeStorage(STORAGE_KEY, localStores().filter((item) => item.id !== String(id)));
  },
};
