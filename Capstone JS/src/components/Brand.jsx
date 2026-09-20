import { Link } from "react-router-dom";

export default function Brand({ admin = false, className = "" }) {
  return (
    <Link className={`brand ${className}`.trim()} to="/" aria-label="TIN STUDIO - Trang chủ">
      <img className="brand-mark" src="/tin-studio-avatar.png" alt="" />
      <span>TIN STUDIO<small>{admin ? "ADMIN CENTER" : "PHONE STORE"}</small></span>
    </Link>
  );
}
