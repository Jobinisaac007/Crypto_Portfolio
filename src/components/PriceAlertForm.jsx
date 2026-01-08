import { useState } from "react";
import { useAlerts } from "../Context/AlertContext";
import { Bell, Plus, Trash2, CheckCircle } from "lucide-react";

export default function PriceAlertForm({ coinId = "bitcoin" }) {
  const {
    alerts,
    addPriceAlert,
    deleteAlert,
    clearTriggeredAlerts,
  } = useAlerts();

  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("above");

  const coinAlerts = alerts.filter((a) => a.coinId === coinId);
  const activeAlerts = coinAlerts.filter((a) => !a.triggered);
  const triggeredAlerts = coinAlerts.filter((a) => a.triggered);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!price || Number(price) <= 0) {
      return;
    }

    addPriceAlert(coinId, price, condition);
    setPrice("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bell size={24} className="text-yellow-500" />
        <h3 className="text-xl font-semibold">Price Alerts</h3>
      </div>

      {/* Create Alert Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400 mb-3">
            Get notified when {coinId.toUpperCase()} reaches your target price
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="p-3 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Target price (₹)"
              className="p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />

            <button
              type="submit"
              className="bg-yellow-500 text-black px-4 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Alert
            </button>
          </div>
        </div>
      </form>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Active Alerts ({activeAlerts.length})
          </h4>
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Bell size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {alert.condition === "above" ? "Above" : "Below"} ₹
                      {Number(alert.targetPrice).toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-400">
                      Created {formatDate(alert.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triggered Alerts */}
      {triggeredAlerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-400">
              Triggered Alerts ({triggeredAlerts.length})
            </h4>
            <button
              onClick={clearTriggeredAlerts}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {triggeredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-400">
                      Target Reached: ₹
                      {Number(alert.targetPrice).toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-400">
                      Triggered {formatDate(alert.triggeredAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeAlerts.length === 0 && triggeredAlerts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Bell size={48} className="mx-auto mb-3 opacity-50" />
          <p>No price alerts set yet</p>
          <p className="text-sm mt-1">
            Create an alert above to get notified
          </p>
        </div>
      )}
    </div>
  );
}