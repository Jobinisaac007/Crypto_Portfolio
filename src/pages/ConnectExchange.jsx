import { useState } from "react";
import { usePortfolio } from "../Context/PortfolioContext";
import { useAlerts } from "../Context/AlertContext";
import { encrypt } from "../utils/encryption";
import {
  Link2,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function ConnectExchange() {
  const { exchanges, addExchange, removeExchange } = usePortfolio();
  const { showToast } = useAlerts();

  const [selectedExchange, setSelectedExchange] = useState("Binance");
  const [apiKey, setApiKey] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableExchanges = [
    {
      name: "Binance",
      logo: "🟡",
      description: "World's largest crypto exchange",
      supported: true,
    },
    {
      name: "Coinbase",
      logo: "🔵",
      description: "US-based exchange platform",
      supported: false,
    },
    {
      name: "Kraken",
      logo: "🟣",
      description: "Secure and reliable trading",
      supported: false,
    },
    {
      name: "KuCoin",
      logo: "🟢",
      description: "Diverse crypto marketplace",
      supported: false,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiKey || !secret) {
      showToast("Please provide both API key and secret", "error");
      return;
    }

    setLoading(true);

    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const exchangeData = {
      id: Date.now(),
      name: selectedExchange,
      apiKey: encrypt(apiKey),
      secret: encrypt(secret),
      connectedAt: new Date().toISOString(),
      status: "connected",
    };

    addExchange(exchangeData);
    showToast(`${selectedExchange} connected successfully! 🚀`, "success");

    // Reset form
    setApiKey("");
    setSecret("");
    setShowSecret(false);
    setLoading(false);
  };

  const handleDisconnect = (id, name) => {
    if (window.confirm(`Disconnect ${name}? This will remove all API credentials.`)) {
      removeExchange(id);
      showToast(`${name} disconnected`, "info");
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Connect Exchange</h1>
        <p className="text-gray-400">
          Link your exchange accounts to automatically sync your portfolio
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-900/20 border border-blue-500 p-4 rounded-lg mb-8 flex items-start gap-3">
        <AlertCircle className="text-blue-400 mt-0.5 flex-shrink-0" size={20} />
        <div className="text-sm text-gray-300">
          <p className="font-semibold text-blue-400 mb-1">
            Security Information
          </p>
          <p>
            Your API keys are encrypted and stored securely. We recommend using
            read-only API keys with no withdrawal permissions for maximum
            security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Exchanges */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Exchanges</h2>
          <div className="space-y-3">
            {availableExchanges.map((exchange) => (
              <div
                key={exchange.name}
                className={`bg-gray-900 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedExchange === exchange.name
                    ? "border-yellow-500"
                    : "border-transparent hover:border-gray-700"
                } ${!exchange.supported && "opacity-50"}`}
                onClick={() =>
                  exchange.supported && setSelectedExchange(exchange.name)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{exchange.logo}</div>
                    <div>
                      <h3 className="font-semibold">{exchange.name}</h3>
                      <p className="text-sm text-gray-400">
                        {exchange.description}
                      </p>
                    </div>
                  </div>
                  {exchange.supported ? (
                    <CheckCircle
                      size={20}
                      className={
                        selectedExchange === exchange.name
                          ? "text-yellow-500"
                          : "text-gray-600"
                      }
                    />
                  ) : (
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Connect {selectedExchange}</h2>
          <div className="bg-gray-900 p-6 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* API Key */}
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
                  placeholder="Enter your API key"
                  disabled={loading}
                />
              </div>

              {/* Secret Key */}
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    required
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full p-3 pr-12 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition"
                    placeholder="Enter your secret key"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showSecret ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 text-yellow-400">
                  How to get API credentials:
                </h4>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Log into your {selectedExchange} account</li>
                  <li>Navigate to API Management section</li>
                  <li>Create a new API key (Read-only recommended)</li>
                  <li>Copy and paste the credentials here</li>
                </ol>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 size={20} />
                    Connect Exchange
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Connected Exchanges */}
      {exchanges.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Connected Exchanges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchanges.map((ex) => (
              <div
                key={ex.id}
                className="bg-gray-900 p-5 rounded-xl border border-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                      {ex.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">{ex.name}</h3>
                      <p className="text-sm text-gray-400">
                        Connected{" "}
                        {new Date(ex.connectedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <div className="text-sm text-gray-400">
                    API Key: ••••••••{ex.apiKey.slice(-4)}
                  </div>
                  <button
                    onClick={() => handleDisconnect(ex.id, ex.name)}
                    className="text-red-400 hover:text-red-300 transition flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} />
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}