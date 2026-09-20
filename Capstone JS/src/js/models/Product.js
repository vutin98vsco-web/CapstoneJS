export default class Product {
  constructor({
    id,
    name = "",
    category,
    type,
    price,
    oldPrice = 0,
    image,
    img,
    images = [],
    description,
    desc,
    screen = "",
    camera,
    backCamera = "",
    frontCamera = "",
    chip = "Đang cập nhật",
    storage = "Đang cập nhật",
    variants = [],
    colors = [],
    details = {},
    stock = null,
    badge = "",
  }) {
    const productImage = image || img || "";
    const rawCategory = category || type || "Khác";
    const normalizedCategory = rawCategory.toLowerCase();

    this.id = String(id ?? "");
    this.name = String(name).trim();
    this.category = normalizedCategory === "iphone"
      ? "iPhone"
      : normalizedCategory === "samsung"
        ? "Samsung"
        : String(rawCategory).trim();
    this.price = Number(price);
    this.oldPrice = Number(oldPrice);
    this.image = String(productImage).trim();
    this.images = Array.isArray(images) && images.length ? images : [this.image];
    this.description = String(description || desc || "Đang cập nhật").trim();
    this.screen = String(screen || "Đang cập nhật").trim();
    this.camera = String(camera || [backCamera, frontCamera].filter(Boolean).join(" · ") || "Đang cập nhật").trim();
    this.chip = String(chip || "Đang cập nhật").trim();
    this.storage = String(storage || "Đang cập nhật").trim();
    this.variants = Array.isArray(variants)
      ? variants
        .map((variant) => ({ storage: String(variant.storage || "").trim(), price: Number(variant.price) }))
        .filter((variant) => variant.storage && Number.isFinite(variant.price))
      : [];
    this.colors = Array.isArray(colors)
      ? colors
        .map((color) => typeof color === "string"
          ? { name: color.trim(), hex: "#d8d9dc", image: "" }
          : {
              name: String(color.name || "").trim(),
              hex: String(color.hex || "#d8d9dc").trim(),
              image: String(color.image || "").trim(),
            })
        .filter((color) => color.name)
      : [];
    this.details = details && typeof details === "object" && !Array.isArray(details) ? details : {};
    this.stock = stock === null || stock === undefined || stock === "" ? null : Number(stock);
    this.badge = String(badge).trim();
  }
}
