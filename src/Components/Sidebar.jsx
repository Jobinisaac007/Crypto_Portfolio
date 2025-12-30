import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-60 h-screen bg-gray-900 text-gray-300 p-5 fixed left-0 top-0 border-r border-gray-700">
      <h1 className="text-2xl font-bold text-green-400 mb-8">CryptoTracker</h1>

      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
        <Link to="/portfolio" className="hover:text-green-400">Portfolio</Link>
        <Link to="/exchanges" className="hover:text-green-400">Exchanges</Link>
        <Link to="/risk" className="hover:text-green-400">Risk Alerts</Link>
        <Link to="/settings" className="hover:text-green-400">Settings</Link>
      </nav>
    </div>
  );
}