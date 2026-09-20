import { useEffect } from "react";
import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";

export default function AboutPage() {
  useEffect(() => { document.body.className = ""; document.title = "Về chúng tôi | TIN STUDIO"; }, []);
  return <><header className="site-header compact-header"><Brand /><nav className="main-nav"><Link to="/">Cửa hàng</Link><Link to="/">Sản phẩm</Link><Link to="/">Chi nhánh</Link></nav></header><main className="about-page"><section className="about-hero"><p className="eyebrow">Về TIN STUDIO</p><h1>Mua điện thoại dễ hiểu,<br />chăm sóc lâu dài.</h1><p>Chúng tôi tập trung vào sản phẩm chính hãng, thông tin minh bạch và trải nghiệm mua sắm gọn gàng cho khách hàng tại TP.HCM.</p></section><section className="about-values"><article><strong>01</strong><h2>Đúng sản phẩm</h2><p>Tư vấn theo nhu cầu thực tế, không chạy theo cấu hình thừa.</p></article><article><strong>02</strong><h2>Đúng giá trị</h2><p>Giá niêm yết rõ ràng cùng chính sách bảo hành 12 tháng.</p></article><article><strong>03</strong><h2>Đúng cam kết</h2><p>Hỗ trợ nhanh trước, trong và sau khi khách hàng nhận máy.</p></article></section><Link className="primary-button" to="/">Khám phá sản phẩm</Link></main></>;
}
