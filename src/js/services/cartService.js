import { readStorage, writeStorage } from "../utils/storage.js";

const CART_KEY = "tinStudioCart";

export const cartService = {
  get() { return readStorage(CART_KEY, []); },
  add(product) {
    const cart = this.get();
    const itemId = [product.id, product.selectedStorage, product.selectedColor].filter(Boolean).join("__") || product.id;
    const item = cart.find((entry) => entry.id === itemId);
    if (item) item.quantity += 1;
    else cart.push({
      id: itemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      storage: product.selectedStorage || "",
      color: product.selectedColor || "",
      quantity: 1,
    });
    writeStorage(CART_KEY, cart);
    return cart;
  },
  update(id, change) {
    const cart = this.get().map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0);
    writeStorage(CART_KEY, cart);
    return cart;
  },
  remove(id) {
    const cart = this.get().filter((item) => item.id !== id);
    writeStorage(CART_KEY, cart);
    return cart;
  },
  clear() { writeStorage(CART_KEY, []); return []; },
};
