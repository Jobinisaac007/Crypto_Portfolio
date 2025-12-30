import Sidebar from "../Components/Sidebar";

export default function Portfolio() {
  const dummyHoldings = [
    { symbol: "BTC", amount: 0.05, value: 1500 },
    { symbol: "ETH", amount: 1.2, value: 2200 },
    { symbol: "BNB", amount: 5, value: 150 },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 p-10 text-white w-full">
        <h1 className="text-3xl font-bold mb-6">Portfolio</h1>

        <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left">Asset</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Value (USD)</th>
            </tr>
          </thead>

          <tbody>
            {dummyHoldings.map((h) => (
              <tr key={h.symbol} className="border-b border-gray-700">
                <td className="p-3">{h.symbol}</td>
                <td className="p-3">{h.amount}</td>
                <td className="p-3">${h.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}