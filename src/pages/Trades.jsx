import { useState } from "react";
import { usePortfolio } from "../Context/PortfolioContext";
import { useAlerts } from "../Context/AlertContext";
import { Plus, Trash2, Filter, TrendingUp, TrendingDown } from "lucide-react";

export default function Trades() {
  const { trades, addTrade, deleteTrade } = usePortfolio();
  const { showToast } = useAlerts();

  const [coin, setCoin] = useState("BTC");
  const [customCoin, setCustomCoin] = useState("");
  const [type, setType] = useState("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterType, setFilterType] = useState("ALL"); // ALL, BUY, SELL

  const coinOptions = [
    { symbol: "BTC", id: "bitcoin" },
    { symbol: "ETH", id: "ethereum" },
    { symbol: "BNB", id: "binancecoin" },
    { symbol: "SOL", id: "solana" },
    { symbol: "ADA", id: "cardano" },
    { symbol: "XRP", id: "ripple" },
    { symbol: "CUSTOM", id: "custom" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedCoin = coin === "CUSTOM" ? customCoin.toUpperCase() : coin;
    const coinId = coin === "CUSTOM" 
      ? customCoin.toLowerCase() 
      : coinOptions.find(c => c.symbol === coin)?.id;

    if (!selectedCoin || !coinId) {
      showToast("Please enter a valid coin", "error");
      return;
    }

    addTrade({
      coinId,
      symbol: selectedCoin,
      type,
      quantity: Number(quantity),
      price: Number(price),
      date,
    });

    showToast(
      `${type} order added: ${quantity} ${selectedCoin} @ ₹${Number(price).toLocaleString()}`,
      "success"
    );

    // Reset form
    setQuantity("");
    setPrice("");
    setCustomCoin("");
  };

  const handleDelete = (id, trade) => {
    if (window.confirm(`Delete ${trade.type} order for ${trade.symbol}?`)) {
      deleteTrade(id);
      showToast("Trade deleted successfully", "info");
    }
  };

  // Filter trades
  const filteredTrades =
    filterType === "ALL"
      ? trades
      : trades.filter((t) => t.type === filterType);

  // Calculate trade stats
  const totalBuyVolume = trades
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const totalSellVolume = trades
    .filter((t) => t.type === "SELL")
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const buyCount = trades.filter((t) => t.type === "BUY").length;
  const sellCount = trades.filter((t) => t.type === "SELL").length;

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Trade History</h1>
        <p className="text-gray-400">
          Track and manage all your cryptocurrency trades
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm mb-1">Total Trades</p>
          <h2 className="text-3xl font-bold">{trades.length}</h2>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-400" />
            <p className="text-green-400 text-sm">Buy Orders</p>
          </div>
          <h2 className="text-3xl font-bold text-green-400">{buyCount}</h2>
          <p className="text-sm text-gray-400 mt-1">
            ₹{totalBuyVolume.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-red-400" />
            <p className="text-red-400 text-sm">Sell Orders</p>
          </div>
          <h2 className="text-3xl font-bold text-red-400">{sellCount}</h2>
          <p className="text-sm text-gray-400 mt-1">
            ₹{totalSellVolume.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm mb-1">Net Volume</p>
          <h2 className="text-3xl font-bold">
            ₹
            {(totalBuyVolume - totalSellVolume).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </h2>
        </div>
      </div>

      {/* Add Trade Form */}
      <div className="bg-gray-900 p-6 rounded-xl mb-8">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Plus size={20} />
          Add New Trade
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Coin Selection */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Asset</label>
              <select
                value={coin}
                onChange={(e) => setCoin(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {coinOptions.map((opt) => (
                  <option key={opt.symbol} value={opt.symbol}>
                    {opt.symbol}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Coin Input */}
            {coin === "CUSTOM" && (
              <div>
                <label className="text-gray-400 text-sm block mb-2">
                  Custom Coin
                </label>
                <input
                  type="text"
                  value={customCoin}
                  onChange={(e) => setCustomCoin(e.target.value)}
                  placeholder="e.g., DOGE"
                  className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            )}

            {/* Trade Type */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">
                Quantity
              </label>
              <input
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-gray-400 text-sm block mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Trade
          </button>
        </form>
      </div>

      {/* Filter */}
      <div className="bg-gray-900 p-4 rounded-xl mb-6 flex items-center gap-4">
        <Filter size={20} className="text-gray-400" />
        <div className="flex gap-2">
          {["ALL", "BUY", "SELL"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === f
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Table */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left py-4 px-6">Date</th>
                <th className="text-left py-4 px-6">Asset</th>
                <th className="text-center py-4 px-6">Type</th>
                <th className="text-right py-4 px-6">Quantity</th>
                <th className="text-right py-4 px-6">Price (₹)</th>
                <th className="text-right py-4 px-6">Total (₹)</th>
                <th className="text-center py-4 px-6">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400">
                    No trades yet. Add your first trade above!
                  </td>
                </tr>
              ) : (
                filteredTrades.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-400">{t.date}</td>
                    <td className="py-4 px-6 font-semibold">{t.symbol}</td>
                    <td className="text-center py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          t.type === "BUY"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="text-right py-4 px-6">{t.quantity}</td>
                    <td className="text-right py-4 px-6">
                      ₹{t.price.toLocaleString("en-IN")}
                    </td>
                    <td className="text-right py-4 px-6 font-semibold">
                      ₹
                      {(t.quantity * t.price).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })}
                    </td>
                    <td className="text-center py-4 px-6">
                      <button
                        onClick={() => handleDelete(t.id, t)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}