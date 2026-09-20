import { useEffect, useMemo, useState } from "react";
import Brand from "../components/Brand.jsx";
import { CartDrawer, Header, ProductCard, ProductModal, Toast } from "../components/ShopComponents.jsx";
import { productService } from "../js/services/productService.js";
import { storeService } from "../js/services/storeService.js";
import { cartService } from "../js/services/cartService.js";
import { formatCurrency } from "../js/utils/format.js";

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState(() => cartService.get());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.body.className = "";
    document.title = "TIN STUDIO | Cửa hàng điện thoại";
    Promise.all([productService.getAll(), storeService.getAll()]).then(([productData, storeData]) => { setProducts(productData); setStores(storeData); }).catch(() => notify("Không thể tải dữ liệu. Vui lòng thử lại."));
  }, []);
  useEffect(() => { document.body.classList.toggle("no-scroll", Boolean(selectedProduct || cartOpen)); return () => document.body.classList.remove("no-scroll"); }, [selectedProduct, cartOpen]);

  function notify(text) { setMessage(text); window.clearTimeout(notify.timer); notify.timer = window.setTimeout(() => setMessage(""), 2200); }
  function addToCart(product) { setCart(cartService.add(product)); notify("Đã thêm sản phẩm vào giỏ hàng."); }
  function checkout() { if (!cart.length) return notify("Giỏ hàng của bạn đang trống."); setCart(cartService.clear()); setCartOpen(false); notify("Thanh toán thành công. Cảm ơn bạn!"); }

  const featured = products.find((item) => item.name.toLowerCase().includes("iphone duo")) || products.find((item) => item.category === "iPhone") || products[0];
  const filtered = useMemo(() => category === "all" ? products : products.filter((item) => item.category === category), [category, products]);
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <Header cartCount={count} onCartOpen={() => setCartOpen(true)} />
      <main>
        <section className="hero" aria-labelledby="heroTitle">
          <div className="hero-copy"><p className="eyebrow">Thế hệ điện thoại mới</p><h1 id="heroTitle">Tương lai mở ra.<br /><span>iPhone Duo.</span></h1><p>Thiết kế gập đột phá, hiệu năng mạnh mẽ và trải nghiệm linh hoạt trong một thiết bị.</p><a className="primary-button" href="#products">Xem sản phẩm</a></div>
          {featured && <div className="hero-product" aria-label={`${featured.name} - sản phẩm nổi bật`}><span className="hero-badge">Mới · Gập</span><span className="hero-spec">{featured.chip}</span><button className="hero-image-button" type="button" onClick={() => setSelectedProduct(featured)} aria-label={`Xem chi tiết ${featured.name}`}><img src={featured.image} alt={featured.name} /></button><div className="hero-product-info"><div><small>Sản phẩm nổi bật</small><strong>{featured.name}</strong></div><div className="hero-product-action"><span>{formatCurrency(featured.price)}</span><button type="button" onClick={() => addToCart(featured)} aria-label={`Thêm ${featured.name} vào giỏ hàng`}>+</button></div></div></div>}
        </section>
        <section className="benefits" aria-label="Chính sách mua hàng"><article><span>2H</span><div><strong>Giao nhanh 2 giờ</strong><small>Nội thành TP.HCM</small></div></article><article><span>12</span><div><strong>Bảo hành 12 tháng</strong><small>Đổi trả minh bạch</small></div></article><article><span>0%</span><div><strong>Trả góp 0%</strong><small>Duyệt hồ sơ nhanh</small></div></article></section>
        <section className="products-section" id="products"><div className="section-heading"><div><p className="eyebrow">Danh mục nổi bật</p><h2>Chọn chiếc máy hợp với bạn</h2></div><div className="filters" role="group" aria-label="Lọc sản phẩm">{[["all", "Tất cả"], ["iPhone", "iPhone"], ["Samsung", "Samsung"]].map(([value, label]) => <button className={`filter-button ${category === value ? "active" : ""}`} type="button" key={value} onClick={() => setCategory(value)}>{label}</button>)}</div></div><div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onDetail={setSelectedProduct} onAdd={addToCart} />)}</div>{!filtered.length && <div className="empty-state">Chưa có sản phẩm trong danh mục này.</div>}</section>
        <section className="stores-section" id="stores"><div className="section-heading"><div><p className="eyebrow">Đến trải nghiệm</p><h2>Chi nhánh TIN STUDIO</h2></div></div><div className="store-grid">{stores.map((store, index) => <article className="store-card" key={store.id}><span className="store-number">0{index + 1}</span><h3>{store.name}</h3><p>{store.address}</p><div><span>{store.hours}</span><a href={`tel:${store.phone.replace(/\s/g, "")}`}>{store.phone}</a></div></article>)}</div></section>
      </main>
      <footer><Brand className="footer-brand" /><p>Điện thoại chính hãng · Giao nhanh tại TP.HCM</p><p>© 2026 TIN STUDIO</p></footer>
      {selectedProduct && <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdate={(id, change) => setCart(cartService.update(id, change))} onRemove={(id) => setCart(cartService.remove(id))} onCheckout={checkout} />}
      <Toast message={message} />
    </>
  );
}
