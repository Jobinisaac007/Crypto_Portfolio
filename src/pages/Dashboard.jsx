import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../Context/PortfolioContext";
import { useAlerts } from "../Context/AlertContext";
import { CoinList } from "../services/cryptoApi";
import { isRisky } from "../utils/riskFlags";
import PriceChart from "../components/PriceChart";
import PriceAlertForm from "../components/PriceAlertForm";
import Notifications from "../components/Notifications";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { holdings, trades, exchanges } = usePortfolio();
  const { alerts, triggerAlert, activeAlerts } = useAlerts();

  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [priceChanges, setPriceChanges] = useState({});
  const currency = "inr";

  // Fetch live prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(CoinList(currency));
        const data = await res.json();

        const priceMap = {};
        const changeMap = {};
        
        data.forEach((coin) => {
          priceMap[coin.id] = coin.current_price;
          changeMap[coin.id] = coin.price_change_percentage_24h;
        });

        setPrices(priceMap);
        setPriceChanges(changeMap);
      } catch (err) {
        console.error("Price fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currency]);

  // Check and trigger alerts
  useEffect(() => {
    activeAlerts.forEach((alert) => {
      const currentPrice = prices[alert.coinId];

      if (currentPrice) {
        const shouldTrigger =
          alert.condition === "above"
            ? currentPrice >= alert.targetPrice
            : currentPrice <= alert.targetPrice;

        if (shouldTrigger) {
          triggerAlert(alert.id);
        }
      }
    });
  }, [prices, activeAlerts, triggerAlert]);

  // Calculate portfolio metrics
  const totalValue = holdings.reduce((sum, h) => {
    const price = prices[h.coinId] || 0;
    return sum + h.quantity * price;
  }, 0);

  const totalInvested = trades
    .filter((t) => t.type === "BUY")
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const profitLoss = totalValue - totalInvested;
  const profitLossPercent =
    totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  const riskyHoldings = holdings.filter((h) => isRisky(h.coinId));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <Notifications />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome back! Here's your portfolio overview.
        </p>
      </div>

      {/* Risk Warning */}
      {riskyHoldings.length > 0 && (
        <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg mb-6 flex items-start gap-3">
          <AlertTriangle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-400">Risk Alert</h3>
            <p className="text-sm text-gray-300 mt-1">
              You're holding {riskyHoldings.length} high-risk asset(s):{" "}
              {riskyHoldings.map((h) => h.symbol).join(", ")}. These coins are
              flagged as potentially risky investments.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Total Portfolio Value */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-black">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-80">Portfolio Value</p>
            <Wallet size={20} className="opacity-80" />
          </div>
          <h2 className="text-3xl font-bold">
            ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            {profitLoss >= 0 ? (
              <TrendingUp size={16} className="opacity-80" />
            ) : (
              <TrendingDown size={16} className="opacity-80" />
            )}
            <span className="text-sm font-medium opacity-80">
              {profitLoss >= 0 ? "+" : ""}
              ₹{Math.abs(profitLoss).toLocaleString("en-IN", { maximumFractionDigits: 0 })} (
              {profitLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Holdings */}
        <div
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors cursor-pointer"
          onClick={() => navigate("/holdings")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Holdings</p>
            <Wallet size={20} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold">{holdings.length}</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <span>View all</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Trades */}
        <div
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors cursor-pointer"
          onClick={() => navigate("/trades")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Trades</p>
            <Activity size={20} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold">{trades.length}</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <span>Manage trades</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Exchanges */}
        <div
          className="bg-gray-800 p-6 rounded-xl hover:bg-gray-750 transition-colors cursor-pointer"
          onClick={() => navigate("/connect")}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Connected Exchanges</p>
            <Activity size={20} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold">{exchanges.length}</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <span>{exchanges.length > 0 ? "Manage" : "Connect now"}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-gray-900 rounded-xl overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Holdings</h3>
          <button
            onClick={() => navigate("/holdings")}
            className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {holdings.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Wallet size={48} className="mx-auto mb-4 opacity-50" />
            <p>No holdings yet. Start trading to see them here!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 border-b border-gray-800">
                  <th className="text-left py-4 px-6">Asset</th>
                  <th className="text-right py-4 px-6">Price</th>
                  <th className="text-right py-4 px-6">24h Change</th>
                  <th className="text-right py-4 px-6">Quantity</th>
                  <th className="text-right py-4 px-6">Value</th>
                  <th className="text-right py-4 px-6">Risk</th>
                </tr>
              </thead>

              <tbody>
                {holdings.slice(0, 5).map((h) => {
                  const price = prices[h.coinId] || 0;
                  const value = h.quantity * price;
                  const change = priceChanges[h.coinId] || 0;
                  const risky = isRisky(h.coinId);

                  return (
                    <tr
                      key={h.coinId}
                      className="border-b border-gray-800 hover:bg-gray-800/50"
                    >
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
                      <td className="text-right py-4 px-6">
                        ₹{price.toLocaleString("en-IN")}
                      </td>
                      <td className="text-right py-4 px-6">
                        <span
                          className={
                            change >= 0 ? "text-green-400" : "text-red-400"
                          }
                        >
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right py-4 px-6">{h.quantity}</td>
                      <td className="text-right py-4 px-6 font-semibold">
                        ₹
                        {value.toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart coinId="bitcoin" />
        <PriceAlertForm coinId="bitcoin" />
      </div>
    </div>
  );
}