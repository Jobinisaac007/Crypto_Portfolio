import { useEffect, useState } from "react";
import { HistoricalChart } from "../services/cryptoApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function PriceChart({ coinId = "bitcoin" }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [priceChange, setPriceChange] = useState(0);
  const currency = "inr";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(HistoricalChart(coinId, days, currency));
        const result = await res.json();

        if (result.prices && result.prices.length > 0) {
          const formatted = result.prices.map((p) => ({
            date: new Date(p[0]).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            }),
            price: Math.round(p[1]),
          }));

          setData(formatted);

          // Calculate price change
          const firstPrice = result.prices[0][1];
          const lastPrice = result.prices[result.prices.length - 1][1];
          const change = ((lastPrice - firstPrice) / firstPrice) * 100;
          setPriceChange(change);
        }
      } catch (err) {
        console.error("Chart fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coinId, days]);

  const timeframes = [
    { label: "1D", value: 1 },
    { label: "7D", value: 7 },
    { label: "1M", value: 30 },
    { label: "3M", value: 90 },
    { label: "1Y", value: 365 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-gray-400 text-sm">{payload[0].payload.date}</p>
          <p className="text-white font-semibold text-lg">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            {coinId.toUpperCase()} Price Chart
          </h3>
          <div
            className={`flex items-center gap-2 ${
              priceChange >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {priceChange >= 0 ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
            <span className="text-lg font-semibold">
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
            <span className="text-sm text-gray-400">
              Last {days} {days === 1 ? "day" : "days"}
            </span>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setDays(tf.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                days === tf.value
                  ? "bg-yellow-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#facc15"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#facc15"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tickLine={false}
            tickFormatter={(value) =>
              `₹${(value / 1000).toFixed(0)}k`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#facc15"
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">Current Price</p>
          <p className="text-xl font-bold">
            ₹{data[data.length - 1]?.price.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm mb-1">
            {days}-Day {priceChange >= 0 ? "Gain" : "Loss"}
          </p>
          <p
            className={`text-xl font-bold ${
              priceChange >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {priceChange >= 0 ? "+" : ""}
            {priceChange.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}