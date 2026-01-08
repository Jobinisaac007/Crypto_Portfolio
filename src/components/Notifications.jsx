import { useAlerts } from "../Context/AlertContext";
import { Bell, X, TrendingUp } from "lucide-react";

export default function Notifications() {
  const { triggeredAlerts, deleteAlert } = useAlerts();

  if (triggeredAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {triggeredAlerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black p-4 rounded-lg shadow-2xl animate-slide-in-right border-2 border-yellow-400"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
              <TrendingUp size={20} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Bell size={16} />
                <h4 className="font-bold text-sm">Price Alert Triggered!</h4>
              </div>
              <p className="text-sm font-medium">
                {alert.coinId.toUpperCase()} reached ₹
                {Number(alert.targetPrice).toLocaleString("en-IN")}
              </p>
              <p className="text-xs opacity-80 mt-1">
                {alert.condition === "above" ? "Above" : "Below"} target price
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => deleteAlert(alert.id)}
              className="flex-shrink-0 text-black/60 hover:text-black transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}