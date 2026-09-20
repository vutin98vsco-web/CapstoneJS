import axios from "axios";
import Product from "../models/Product.js";

const DEFAULT_API_URL = "https://6aaa8e62ff4dd5698b4eb2bb.mockapi.io/Products";
const API_URL = import.meta.env.VITE_PRODUCT_API_URL?.trim() || DEFAULT_API_URL;

function toApiProduct(payload) {
  return {
    name: payload.name,
    price: Number(payload.price),
    screen: payload.screen,
    backCamera: payload.camera,
    frontCamera: payload.frontCamera || "Đang cập nhật",
    img: payload.image,
    desc: payload.description,
    type: payload.category,
    oldPrice: Number(payload.oldPrice || 0),
    images: payload.images || [payload.image],
    chip: payload.chip,
    storage: payload.storage,
    variants: payload.variants || [],
    colors: payload.colors || [],
    details: payload.details || {},
    stock: Number(payload.stock || 0),
    badge: payload.badge || "",
  };
}

export const productService = {
  async getAll() {
    const { data } = await axios.get(API_URL);
    return data.map((item) => new Product(item));
  },
  async create(payload) {
    return new Product((await axios.post(API_URL, toApiProduct(payload))).data);
  },
  async update(id, payload) {
    return new Product((await axios.put(`${API_URL}/${id}`, toApiProduct(payload))).data);
  },
  async remove(id) {
    await axios.delete(`${API_URL}/${id}`);
  },
};
