import { Link } from "react-router-dom";

export default function Brand({ admin = false, className = "" }) {
  return (
    <Link className={`brand ${className}`.trim()} to="/" aria-label="TIN STUDIO - Trang chủ">
      <span className="brand-mark">T</span>
      <span>TIN STUDIO<small>{admin ? "ADMIN CENTER" : "PHONE STORE"}</small></span>
    </Link>
  );
}
