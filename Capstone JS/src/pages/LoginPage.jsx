import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/Brand.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const loggedIn = sessionStorage.getItem("tinStudioAdmin") === "true";
  useEffect(() => { document.body.className = "auth-page"; document.title = "Đăng nhập quản trị | TIN STUDIO"; return () => { document.body.className = ""; }; }, []);
  if (loggedIn) return <Navigate to="/admin" replace />;
  function submit(event) { event.preventDefault(); const data = new FormData(event.currentTarget); if (data.get("username") === "admin" && data.get("password") === "123456") { sessionStorage.setItem("tinStudioAdmin", "true"); navigate("/admin"); } else setError("Tên đăng nhập hoặc mật khẩu không đúng."); }
  return <main className="auth-card"><Brand admin className="auth-brand" /><p className="eyebrow">Khu vực quản trị</p><h1>Đăng nhập</h1><p className="auth-note">Khách hàng không cần đăng nhập để xem và mua sản phẩm.</p><form onSubmit={submit} noValidate><label>Tên đăng nhập<input name="username" autoComplete="username" required /></label><label>Mật khẩu<input name="password" type="password" autoComplete="current-password" required /></label><p className="form-error" role="alert">{error}</p><button className="primary-button full-button" type="submit">Đăng nhập</button></form><p className="demo-account">Tài khoản demo: <strong>admin</strong> · Mật khẩu: <strong>123456</strong></p><Link className="back-link" to="/">← Quay lại cửa hàng</Link></main>;
}
