import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="p-4 bg-black text-white flex gap-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/connect">Connect Exchange</Link>
    </nav>
  );
}