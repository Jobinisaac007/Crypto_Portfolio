import { useEffect, useState } from "react";
import { usePortfolio } from "../Context/PortfolioContext";
import { CoinList } from "../services/cryptoApi";
import { isRisky } from "../utils/riskFlags";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";

export default function Holdings() {
  const { holdings, getCostBasis } = usePortfolio();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("value"); // value, quantity, price, change

  const currency = "inr";

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(CoinList(currency));
        const data = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Price fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPrice = (coinId) => {
    const coin = prices.find((c) => c.id === coinId);
    return coin ? coin.current_price : 0;
  };

  const getPriceChange = (coinId) => {
    const coin = prices.find((c) => c.id === coinId);
    return coin ? coin.price_change_percentage_24h : 0;
  };

  const getValue = (coinId, qty) => {
    return getPrice(coinId) * qty;
  };

  // Filter holdings by search term
  const filteredHoldings = holdings.filter(
    (h) =>
      h.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.coinId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort holdings
  const sortedHoldings = [...filteredHoldings].sort((a, b) => {
    switch (sortBy) {
      case "value":
        return getValue(b.coinId, b.quantity) - getValue(a.coinId, a.quantity);
      case "quantity":
        return b.quantity - a.quantity;
      case "price":
        return getPrice(b.coinId) - getPrice(a.coinId);
      case "change":
        return getPriceChange(b.coinId) - getPriceChange(a.coinId);
      default:
        return 0;
    }
  });

  // Calculate total portfolio value
  const totalValue = holdings.reduce(
    (sum, h) => sum + getValue(h.coinId, h.quantity),
    0
  );

  const totalCost = holdings.reduce((sum, h) => {
    const costBasis = getCostBasis(h.coinId);
    return sum + costBasis * h.quantity;
  }, 0);

  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent =
    totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Holdings</h1>
        <p className="text-gray-400">
          Track all your cryptocurrency holdings in one place
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-black">
          <p className="text-sm font-medium opacity-80 mb-1">Total Value</p>
          <h2 className="text-3xl font-bold">
            ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </h2>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm mb-1">Total Assets</p>
          <h2 className="text-3xl font-bold">{holdings.length}</h2>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl">
          <p className="text-gray-400 text-sm mb-1">Profit/Loss</p>
          <h2
            className={`text-3xl font-bold ${
              totalProfitLoss >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {totalProfitLoss >= 0 ? "+" : ""}
            ₹
            {Math.abs(totalProfitLoss).toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {totalProfitLossPercent >= 0 ? "+" : ""}
            {totalProfitLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-900 p-4 rounded-xl mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="value">Sort by Value</option>
            <option value="quantity">Sort by Quantity</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left py-4 px-6">Asset</th>
                <th className="text-right py-4 px-6">Price</th>
                <th className="text-right py-4 px-6">24h Change</th>
                <th className="text-right py-4 px-6">Quantity</th>
                <th className="text-right py-4 px-6">Avg Cost</th>
                <th className="text-right py-4 px-6">Total Value</th>
                <th className="text-right py-4 px-6">P&L</th>
                <th className="text-right py-4 px-6">Risk</th>
              </tr>
            </thead>

            <tbody>
              {sortedHoldings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-400">
                    {searchTerm
                      ? "No holdings match your search"
                      : "No holdings yet. Start trading to see them here!"}
                  </td>
                </tr>
              ) : (
                sortedHoldings.map((h) => {
                  const price = getPrice(h.coinId);
                  const value = getValue(h.coinId, h.quantity);
                  const change = getPriceChange(h.coinId);
                  const costBasis = getCostBasis(h.coinId);
                  const profitLoss = value - costBasis * h.quantity;
                  const profitLossPercent =
                    costBasis > 0
                      ? ((price - costBasis) / costBasis) * 100
                      : 0;
                  const risky = isRisky(h.coinId);

                  return (
                    <tr
                      key={h.coinId}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Asset */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
                            {h.symbol[0]}
                          </div>
                          <div>
                            <div className="font-semibold">{h.symbol}</div>
                            <div className="text-sm text-gray-400 capitalize">
                              {h.coinId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="text-right py-4 px-6 font-medium">
                        ₹{price.toLocaleString("en-IN")}
                      </td>

                      {/* 24h Change */}
                      <td className="text-right py-4 px-6">
                        <div
                          className={`inline-flex items-center gap-1 ${
                            change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {change >= 0 ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          <span>
                            {change >= 0 ? "+" : ""}
                            {change.toFixed(2)}%
                          </span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="text-right py-4 px-6">{h.quantity}</td>

                      {/* Avg Cost */}
                      <td className="text-right py-4 px-6 text-gray-400">
                        ₹{costBasis.toLocaleString("en-IN")}
                      </td>

                      {/* Total Value */}
                      <td className="text-right py-4 px-6 font-semibold">
                        ₹
                        {value.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>

                      {/* P&L */}
                      <td className="text-right py-4 px-6">
                        <div
                          className={
                            profitLoss >= 0 ? "text-green-400" : "text-red-400"
                          }
                        >
                          <div className="font-semibold">
                            {profitLoss >= 0 ? "+" : ""}₹
                            {Math.abs(profitLoss).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-sm">
                            {profitLossPercent >= 0 ? "+" : ""}
                            {profitLossPercent.toFixed(2)}%
                          </div>
                        </div>
                      </td>

                      {/* Risk */}
                      <td className="text-right py-4 px-6">
                        {risky ? (
                          <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                            <AlertTriangle size={14} />
                            High
                          </span>
                        ) : (
                          <span className="text-green-400 text-sm">Low</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}