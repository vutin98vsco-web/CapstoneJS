import { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "./Brand.jsx";
import { formatCurrency } from "../js/utils/format.js";

export function Header({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToSection(event, sectionId) {
    event.preventDefault();
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <div className="promo-bar">Miễn phí giao hàng cho đơn từ 2.000.000đ · Thu cũ đổi mới</div>
      <header className="site-header">
        <Brand />
        <button className="menu-button" type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Điều hướng chính">
          <a href="#products" onClick={(event) => scrollToSection(event, "products")}>Sản phẩm</a>
          <a href="#stores" onClick={(event) => scrollToSection(event, "stores")}>Chi nhánh</a>
          <Link to="/about">Về chúng tôi</Link>
          <Link to="/login">Quản trị</Link>
        </nav>
        <button className="cart-button" type="button" aria-label="Mở giỏ hàng" onClick={onCartOpen}>Giỏ hàng <span>{cartCount}</span></button>
      </header>
    </>
  );
}

export function ProductCard({ product, onDetail, onAdd }) {
  return (
    <article className="product-card">
      <button className="product-image-button" type="button" onClick={() => onDetail(product)} aria-label={`Xem chi tiết ${product.name}`}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
      </button>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <h3><button type="button" onClick={() => onDetail(product)}>{product.name}</button></h3>
        <div className="price-row"><strong>{formatCurrency(product.price)}</strong>{product.oldPrice > 0 && <del>{formatCurrency(product.oldPrice)}</del>}</div>
        <div className="card-actions"><button className="ghost-button" type="button" onClick={() => onDetail(product)}>Chi tiết</button><button className="primary-button small-button" type="button" onClick={() => product.variants.length ? onDetail(product) : onAdd(product)}>Thêm vào giỏ</button></div>
      </div>
    </article>
  );
}

export function ProductModal({ product, onClose, onAdd }) {
  const [image, setImage] = useState(product?.images?.[0] || "");
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  if (!product) return null;

  const selectedPrice = selectedVariant?.price ?? product.price;

  function addConfiguredProduct() {
    onAdd({
      ...product,
      price: selectedPrice,
      selectedStorage: selectedVariant?.storage || "",
      selectedColor: selectedColor?.name || "",
    });
  }

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="productModalTitle" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal product-modal">
        <button className="close-button" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <div className="product-detail">
          <div className="detail-gallery"><div className="detail-main-image"><img src={image} alt={product.name} /></div><div className="detail-thumbnails">{product.images.slice(0, 4).map((item, index) => <button className={image === item ? "active" : ""} type="button" key={`${item}-${index}`} onClick={() => setImage(item)}><img src={item} alt={`Góc chụp ${index + 1}`} /></button>)}</div></div>
          <div className="detail-copy">
            <span className="product-category">{product.category}</span>
            <h2 id="productModalTitle">{product.name}</h2>
            <div className="detail-price"><strong>{formatCurrency(selectedPrice)}</strong>{product.oldPrice > 0 && <del>{formatCurrency(product.oldPrice)}</del>}</div>
            {product.variants.length > 0 && <div className="product-options">
              <div className="option-heading"><strong>Chọn dung lượng</strong><span>{selectedVariant?.storage}</span></div>
              <div className="storage-options">{product.variants.map((variant) => <button className={`storage-option ${selectedVariant?.storage === variant.storage ? "active" : ""}`} type="button" key={variant.storage} aria-pressed={selectedVariant?.storage === variant.storage} onClick={() => setSelectedVariant(variant)}><strong>{variant.storage}</strong><small>{formatCurrency(variant.price)}</small></button>)}</div>
            </div>}
            {product.colors.length > 0 && <div className="product-options">
              <div className="option-heading"><strong>Chọn màu</strong><span>{selectedColor?.name}</span></div>
              <div className="color-options">{product.colors.map((color) => <button className={`color-option ${selectedColor?.name === color.name ? "active" : ""}`} type="button" key={color.name} aria-label={`Chọn màu ${color.name}`} aria-pressed={selectedColor?.name === color.name} onClick={() => setSelectedColor(color)}><span className="color-swatch" style={{ backgroundColor: color.hex }} /><span>{color.name}</span></button>)}</div>
            </div>}
            <p>{product.description}</p>
            <dl><div><dt>Màn hình</dt><dd>{product.screen}</dd></div><div><dt>Camera</dt><dd>{product.camera}</dd></div><div><dt>Chip</dt><dd>{product.chip}</dd></div><div><dt>Bộ nhớ</dt><dd>{selectedVariant?.storage || product.storage}</dd></div></dl>
            <p className="stock-line">{product.stock === null ? "Sản phẩm đang có sẵn" : `Còn ${product.stock} sản phẩm`}</p>
            <button className="primary-button full-button" type="button" onClick={addConfiguredProduct}>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer({ cart, onClose, onUpdate, onRemove, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="overlay" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer"><div className="drawer-header"><h2 id="cartTitle">Giỏ hàng</h2><button className="close-button" type="button" onClick={onClose} aria-label="Đóng">×</button></div><div className="cart-items">{cart.length ? cart.map((item) => <article className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div><h3>{item.name}</h3>{(item.storage || item.color) && <small className="cart-variant">{[item.storage, item.color].filter(Boolean).join(" · ")}</small>}<strong>{formatCurrency(item.price)}</strong><div className="quantity-control"><button type="button" onClick={() => onUpdate(item.id, -1)}>−</button><span>{item.quantity}</span><button type="button" onClick={() => onUpdate(item.id, 1)}>+</button></div></div><button className="remove-button" type="button" onClick={() => onRemove(item.id)} aria-label={`Xóa ${item.name}`}>×</button></article>) : <div className="cart-empty"><strong>Giỏ hàng đang trống</strong><p>Chọn một sản phẩm phù hợp để bắt đầu.</p></div>}</div><div className="cart-footer"><div className="cart-total"><span>Tạm tính</span><strong>{formatCurrency(total)}</strong></div><button className="primary-button full-button" type="button" onClick={onCheckout}>Thanh toán</button></div></aside>
    </div>
  );
}

export function Toast({ message }) {
  return <div className={`toast ${message ? "show" : ""}`} role="status" aria-live="polite">{message}</div>;
}
