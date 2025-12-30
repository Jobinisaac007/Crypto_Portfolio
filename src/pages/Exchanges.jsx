import React, { useEffect, useState } from "react";
import Sidebar from "../Components/Sidebar";
import {
  getExchangeKeys,
  addExchangeKey,
  deleteExchangeKey,
  testExchangeConnection,
} from "../api/cryptoApi";

export default function Exchanges() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    label: "",
    exchange: "binance",
    apiKey: "",
    apiSecret: "",
  });

  const fetchKeys = async () => {
    setLoading(true);
    const data = await getExchangeKeys();
    setKeys(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.label || !form.apiKey || !form.apiSecret) {
      alert("All fields are required!");
      return;
    }

    await addExchangeKey(form);
    setForm({ label: "", exchange: "binance", apiKey: "", apiSecret: "" });
    fetchKeys();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this exchange connection?")) return;
    await deleteExchangeKey(id);
    fetchKeys();
  };

  const handleTest = async (id) => {
    const res = await testExchangeConnection(id);
    alert(res.message || "Connection OK");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-semibold mb-4">Exchange Connections</h1>

        {/* ADD NEW KEY FORM */}
        <form
          onSubmit={handleAdd}
          className="bg-white p-4 rounded shadow max-w-lg mb-4"
        >
          <h2 className="text-lg font-semibold mb-3">Add Exchange Key</h2>

          <select
            className="border p-2 w-full mb-2"
            value={form.exchange}
            onChange={(e) =>
              setForm({ ...form, exchange: e.target.value })
            }
          >
            <option value="binance">Binance</option>
            <option value="coinbase">Coinbase</option>
          </select>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Label (My Binance)"
            value={form.label}
            onChange={(e) =>
              setForm({ ...form, label: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="API Key"
            value={form.apiKey}
            onChange={(e) =>
              setForm({ ...form, apiKey: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="API Secret"
            type="password"
            value={form.apiSecret}
            onChange={(e) =>
              setForm({ ...form, apiSecret: e.target.value })
            }
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Add Exchange
          </button>
        </form>

        {/* LIST OF SAVED EXCHANGE KEYS */}
        {loading ? (
          <div>Loading...</div>
        ) : keys.length === 0 ? (
          <div>No exchange keys added yet.</div>
        ) : (
          <div className="space-y-3">
            {keys.map((ex) => (
              <div
                key={ex.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{ex.label}</p>
                  <p className="text-sm text-gray-600">
                    Exchange: {ex.exchange}
                  </p>
                </div>

                <div className="space-x-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => handleTest(ex.id)}
                  >
                    Test
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => handleDelete(ex.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}