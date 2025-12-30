import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { CoinList, TrendingCoins } from "../api/cryptoApi";

export default function Dashboard() {
  const [coins, setCoins] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const currency = "usd";

  // Fetch top market cap coins
  const fetchCoins = async () => {
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (err) {
      console.log("Error fetching CoinList:", err);
    }
  };

  // Fetch trending coins
  const fetchTrending = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    } catch (err) {
      console.log("Error fetching TrendingCoins:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCoins();
      await fetchTrending();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6">

          {/* Portfolio Summary */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-2">Your Portfolio Value</h2>
            <p className="text-3xl font-semibold text-blue-600">$12,530.45</p>
            <p className="text-green-500 mt-1">+5.2% Today</p>
          </div>

          {/* Trending Coins */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h2 className="text-xl font-bold mb-4">🔥 Trending Coins</h2>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {trending.map((coin) => (
                  <div
                    key={coin.id}
                    className="p-4 border rounded-lg shadow hover:shadow-lg transition bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <img src={coin.image} className="w-8 h-8" />
                      <p className="font-semibold">{coin.name}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ${coin.current_price.toLocaleString()}
                    </p>
                    <p
                      className={`mt-1 font-semibold ${
                        coin.price_change_percentage_24h > 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top 10 Coins Table */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">📊 Top Cryptocurrencies</h2>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Coin</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">24h Change</th>
                    <th className="py-2">Market Cap</th>
                  </tr>
                </thead>

                <tbody>
                  {coins.slice(0, 10).map((coin) => (
                    <tr key={coin.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 flex items-center gap-2">
                        <img src={coin.image} alt="" className="w-6 h-6" />
                        {coin.name}
                      </td>

                      <td className="py-3">${coin.current_price.toLocaleString()}</td>

                      <td
                        className={`py-3 ${
                          coin.price_change_percentage_24h > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>

                      <td className="py-3">
                        ${coin.market_cap.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}