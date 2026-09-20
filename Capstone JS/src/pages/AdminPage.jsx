import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import { Toast } from "../components/ShopComponents.jsx";
import { productService } from "../js/services/productService.js";
import { storeService } from "../js/services/storeService.js";
import { validateProduct, validateStore } from "../js/utils/validation.js";
import { formatCurrency } from "../js/utils/format.js";

const emptyProduct = { name: "", category: "", price: "", oldPrice: "", stock: "", image: "", images: [], screen: "", camera: "", frontCamera: "", chip: "", storage: "", badge: "", description: "", variants: [], colors: [], details: {} };
const emptyStore = { name: "", address: "", hours: "", phone: "" };

function AdminForm({ modal, onClose, onSaved }) {
  const isProduct = modal.type === "product";
  const [data, setData] = useState(() => {
    if (!isProduct) return { ...emptyStore, ...modal.item };
    const item = { ...emptyProduct, ...modal.item };
    return {
      ...item,
      images: (item.images || []).filter(Boolean),
      variants: (item.variants || []).map((variant) => ({ ...variant })),
      colors: (item.colors || []).map((color) => ({ ...color })),
      detailRows: Object.entries(item.details || {}).map(([label, value]) => ({ label, value })),
    };
  });
  const [errors, setErrors] = useState({});
  function change(event) { setData({ ...data, [event.target.name]: event.target.value }); }
  function updateList(list, index, field, value) {
    setData((current) => ({ ...current, [list]: current[list].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  }
  function addListItem(list, item) { setData((current) => ({ ...current, [list]: [...current[list], item] })); }
  function removeListItem(list, index) { setData((current) => ({ ...current, [list]: current[list].filter((_, itemIndex) => itemIndex !== index) })); }
  function updateImage(index, value) { setData((current) => ({ ...current, images: current.images.map((image, imageIndex) => imageIndex === index ? value : image) })); }
  function addImage() { setData((current) => ({ ...current, images: [...current.images, ""] })); }
  function removeImage(index) { setData((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) })); }
  async function submit(event) {
    event.preventDefault();
    const normalizedImages = isProduct ? [data.image, ...data.images, ...data.colors.map((color) => color.image)].map((item) => item?.trim()).filter((item, index, list) => item && list.indexOf(item) === index) : [];
    const normalizedData = isProduct ? {
      ...data,
      images: normalizedImages,
      variants: data.variants.map((variant) => ({ storage: variant.storage.trim(), price: Number(variant.price) })).filter((variant) => variant.storage),
      colors: data.colors.map((color) => ({ name: color.name.trim(), hex: color.hex || "#d8d9dc", image: color.image.trim() })).filter((color) => color.name),
      details: Object.fromEntries(data.detailRows.map((detail) => [detail.label.trim(), String(detail.value).trim()]).filter(([label]) => label)),
    } : data;
    const validation = isProduct ? validateProduct(normalizedData) : validateStore(normalizedData);
    if (Object.keys(validation).length) return setErrors(validation);
    try {
      if (isProduct) {
        const payload = { ...normalizedData, price: Number(data.price), oldPrice: Number(data.oldPrice || 0), stock: Number(data.stock) };
        if (modal.item?.id) await productService.update(modal.item.id, payload); else await productService.create(payload);
      } else if (modal.item?.id) await storeService.update(modal.item.id, normalizedData); else await storeService.create(normalizedData);
      onSaved();
    } catch { setErrors({ api: "Không thể lưu dữ liệu. Vui lòng thử lại." }); }
  }
  return (
    <div className="overlay" role="dialog" aria-modal="true" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal admin-modal">
        <button className="close-button" type="button" onClick={onClose} aria-label="Đóng">×</button>
        <h2>{modal.item?.id ? "Cập nhật" : "Thêm"} {isProduct ? "sản phẩm" : "chi nhánh"}</h2>
        <form onSubmit={submit} noValidate>
          {isProduct ? <>
            <section className="admin-form-section"><h3>Thông tin cơ bản</h3><div className="form-grid"><label className="span-2">Tên sản phẩm<input name="name" value={data.name} onChange={change} /></label><label>Loại<select name="category" value={data.category} onChange={change}><option value="">Chọn loại</option><option>iPhone</option><option>Samsung</option></select></label><label>Giá bán mặc định<input name="price" type="number" min="0" value={data.price} onChange={change} /></label><label>Giá cũ<input name="oldPrice" type="number" min="0" value={data.oldPrice} onChange={change} /></label><label>Tồn kho<input name="stock" type="number" min="0" step="1" value={data.stock ?? ""} onChange={change} /></label><label className="span-2">Ảnh đại diện<input name="image" value={data.image} onChange={change} placeholder="https://... hoặc /products/..." /></label><label>Nhãn nổi bật<input name="badge" value={data.badge} onChange={change} /></label><label>Bộ nhớ mô tả<input name="storage" value={data.storage} onChange={change} /></label><label className="span-2">Mô tả<textarea name="description" rows="3" value={data.description} onChange={change} /></label></div></section>

            <DynamicSection title="Dung lượng và giá" onAdd={() => addListItem("variants", { storage: "", price: "" })} addLabel="Thêm dung lượng">
              {data.variants.map((variant, index) => <div className="dynamic-row variant-row" key={`variant-${index}`}><input aria-label={`Dung lượng ${index + 1}`} placeholder="256GB" value={variant.storage} onChange={(event) => updateList("variants", index, "storage", event.target.value)} /><input aria-label={`Giá dung lượng ${index + 1}`} placeholder="Giá bán" type="number" min="0" value={variant.price} onChange={(event) => updateList("variants", index, "price", event.target.value)} /><RemoveButton onClick={() => removeListItem("variants", index)} /></div>)}
            </DynamicSection>

            <DynamicSection title="Màu sắc và ảnh tương ứng" onAdd={() => addListItem("colors", { name: "", hex: "#d8d9dc", image: "" })} addLabel="Thêm màu">
              {data.colors.map((color, index) => <div className="dynamic-row color-row" key={`color-${index}`}><input aria-label={`Tên màu ${index + 1}`} placeholder="Tên màu" value={color.name} onChange={(event) => updateList("colors", index, "name", event.target.value)} /><input className="color-picker" aria-label={`Mã màu ${index + 1}`} type="color" value={/^#[0-9a-f]{6}$/i.test(color.hex) ? color.hex : "#d8d9dc"} onChange={(event) => updateList("colors", index, "hex", event.target.value)} /><input aria-label={`Ảnh màu ${index + 1}`} placeholder="Ảnh của màu này" value={color.image} onChange={(event) => updateList("colors", index, "image", event.target.value)} /><RemoveButton onClick={() => removeListItem("colors", index)} /></div>)}
            </DynamicSection>

            <DynamicSection title="Thư viện ảnh" onAdd={addImage} addLabel="Thêm ảnh">
              {data.images.map((image, index) => <div className="dynamic-row image-row" key={`image-${index}`}><input aria-label={`Ảnh thư viện ${index + 1}`} placeholder="https://... hoặc /products/..." value={image} onChange={(event) => updateImage(index, event.target.value)} />{image && <img className="admin-image-preview" src={image} alt="" />}<RemoveButton onClick={() => removeImage(index)} /></div>)}
            </DynamicSection>

            <section className="admin-form-section"><h3>Thông số chính</h3><div className="form-grid"><label>Màn hình<input name="screen" value={data.screen} onChange={change} /></label><label>Chip xử lý<input name="chip" value={data.chip} onChange={change} /></label><label>Camera sau<input name="camera" value={data.camera} onChange={change} /></label><label>Camera trước<input name="frontCamera" value={data.frontCamera || ""} onChange={change} /></label></div></section>

            <DynamicSection title="Thông số chi tiết" onAdd={() => addListItem("detailRows", { label: "", value: "" })} addLabel="Thêm thông số">
              {data.detailRows.map((detail, index) => <div className="dynamic-row detail-row" key={`detail-${index}`}><input aria-label={`Tên thông số ${index + 1}`} placeholder="Ví dụ: Pin" value={detail.label} onChange={(event) => updateList("detailRows", index, "label", event.target.value)} /><input aria-label={`Giá trị thông số ${index + 1}`} placeholder="Ví dụ: 5.000 mAh" value={detail.value} onChange={(event) => updateList("detailRows", index, "value", event.target.value)} /><RemoveButton onClick={() => removeListItem("detailRows", index)} /></div>)}
            </DynamicSection>
          </> : <div className="form-grid"><label className="span-2">Tên chi nhánh<input name="name" value={data.name} onChange={change} /></label><label className="span-2">Địa chỉ<input name="address" value={data.address} onChange={change} /></label><label>Giờ mở cửa<input name="hours" value={data.hours} onChange={change} /></label><label>Số điện thoại<input name="phone" value={data.phone} onChange={change} /></label></div>}
          <div className="form-errors">{Object.values(errors).map((item) => <p key={item}>{item}</p>)}</div>
          <button className="primary-button full-button" type="submit">{modal.item?.id ? "Lưu thay đổi" : isProduct ? "Thêm sản phẩm" : "Thêm chi nhánh"}</button>
        </form>
      </div>
    </div>
  );
}

function DynamicSection({ title, onAdd, addLabel, children }) {
  return <section className="admin-form-section"><div className="dynamic-heading"><h3>{title}</h3><button className="add-row-button" type="button" onClick={onAdd}>+ {addLabel}</button></div><div className="dynamic-list">{children}</div></section>;
}

function RemoveButton({ onClick }) {
  return <button className="remove-row-button" type="button" onClick={onClick} aria-label="Xóa dòng">×</button>;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const loggedIn = sessionStorage.getItem("tinStudioAdmin") === "true";
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [tab, setTab] = useState("products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState("");
  const notifyTimer = useRef(null);
  const notify = useCallback((text) => {
    setMessage(text);
    window.clearTimeout(notifyTimer.current);
    notifyTimer.current = window.setTimeout(() => setMessage(""), 2200);
  }, []);
  const load = useCallback(async () => {
    try {
      const [productData, storeData] = await Promise.all([productService.getAll(), storeService.getAll()]);
      setProducts(productData);
      setStores(storeData);
    } catch {
      notify("Không thể tải dữ liệu.");
    }
  }, [notify]);
  useEffect(() => {
    document.body.className = "admin-page";
    document.title = "Quản trị | TIN STUDIO";
    if (loggedIn) Promise.resolve().then(load);
    return () => {
      document.body.className = "";
      window.clearTimeout(notifyTimer.current);
    };
  }, [load, loggedIn]);
  async function removeProduct(id) { if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return; await productService.remove(id); await load(); notify("Đã xóa sản phẩm."); }
  async function removeStore(id) { if (!window.confirm("Bạn chắc chắn muốn xóa chi nhánh này?")) return; await storeService.remove(id); await load(); notify("Đã xóa chi nhánh."); }
  const visibleProducts = useMemo(() => { const result = products.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())); if (sort === "asc") result.sort((a, b) => a.price - b.price); if (sort === "desc") result.sort((a, b) => b.price - a.price); return result; }, [products, search, sort]);
  if (!loggedIn) return <Navigate to="/login" replace />;
  return (
    <>
      <aside className="admin-sidebar"><Brand admin /><nav><button className={`admin-tab ${tab === "products" ? "active" : ""}`} type="button" onClick={() => setTab("products")}>Sản phẩm</button><button className={`admin-tab ${tab === "stores" ? "active" : ""}`} type="button" onClick={() => setTab("stores")}>Chi nhánh</button><Link to="/">Xem cửa hàng</Link></nav><button className="logout-button" type="button" onClick={() => { sessionStorage.removeItem("tinStudioAdmin"); navigate("/login"); }}>Đăng xuất</button></aside>
      <main className="admin-main">
        <header className="admin-header"><div><p className="eyebrow">Bảng điều khiển</p><h1>Quản lý cửa hàng</h1></div><span className="admin-user">Xin chào, Admin</span></header>
        {tab === "products" ? <section className="admin-panel"><div className="admin-toolbar"><div><h2>Danh sách sản phẩm</h2><p>{visibleProducts.length} sản phẩm</p></div><button className="primary-button" type="button" onClick={() => setModal({ type: "product", item: null })}>+ Thêm sản phẩm</button></div><div className="table-controls"><input type="search" placeholder="Tìm theo tên sản phẩm..." value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Sắp xếp giá" value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Sắp xếp mặc định</option><option value="asc">Giá tăng dần</option><option value="desc">Giá giảm dần</option></select></div><div className="table-wrap"><table><thead><tr><th>Sản phẩm</th><th>Loại</th><th>Giá</th><th>Tồn kho</th><th>Thao tác</th></tr></thead><tbody>{visibleProducts.map((item) => <tr key={item.id}><td><div className="table-product"><img src={item.image} alt="" /><strong>{item.name}</strong></div></td><td><span className="category-pill">{item.category}</span></td><td>{formatCurrency(item.price)}</td><td>{item.stock ?? "—"}</td><td><div className="row-actions"><button type="button" onClick={() => setModal({ type: "product", item })}>Sửa</button><button className="danger-action" type="button" onClick={() => removeProduct(item.id)}>Xóa</button></div></td></tr>)}{!visibleProducts.length && <tr><td colSpan="5" className="table-empty">Không tìm thấy sản phẩm.</td></tr>}</tbody></table></div></section> : <section className="admin-panel"><div className="admin-toolbar"><div><h2>Danh sách chi nhánh</h2><p>{stores.length} chi nhánh</p></div><button className="primary-button" type="button" onClick={() => setModal({ type: "store", item: null })}>+ Thêm chi nhánh</button></div><div className="table-wrap"><table><thead><tr><th>Tên chi nhánh</th><th>Địa chỉ</th><th>Giờ mở cửa</th><th>Thao tác</th></tr></thead><tbody>{stores.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.address}</td><td>{item.hours}</td><td><div className="row-actions"><button type="button" onClick={() => setModal({ type: "store", item })}>Sửa</button><button className="danger-action" type="button" onClick={() => removeStore(item.id)}>Xóa</button></div></td></tr>)}</tbody></table></div></section>}
      </main>
      {modal && <AdminForm modal={modal} onClose={() => setModal(null)} onSaved={async () => { setModal(null); await load(); notify("Đã lưu dữ liệu thành công."); }} />}
      <Toast message={message} />
    </>
  );
}
