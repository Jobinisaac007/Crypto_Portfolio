import { createContext, useContext, useState, useEffect } from "react";

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  // Holdings state with localStorage persistence
  const [holdings, setHoldings] = useState(() => {
    try {
      const stored = localStorage.getItem("holdings");
      return stored
        ? JSON.parse(stored)
        : [
            { coinId: "bitcoin", symbol: "BTC", quantity: 0.5 },
            { coinId: "ethereum", symbol: "ETH", quantity: 2 },
          ];
    } catch {
      return [
        { coinId: "bitcoin", symbol: "BTC", quantity: 0.5 },
        { coinId: "ethereum", symbol: "ETH", quantity: 2 },
      ];
    }
  });

  // Trades state with localStorage persistence
  const [trades, setTrades] = useState(() => {
    try {
      const stored = localStorage.getItem("trades");
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 1,
              coinId: "bitcoin",
              symbol: "BTC",
              type: "BUY",
              quantity: 0.5,
              price: 2500000,
              date: "2024-01-10",
            },
          ];
    } catch {
      return [];
    }
  });

  // Exchanges state with localStorage persistence
  const [exchanges, setExchanges] = useState(() => {
    try {
      const stored = localStorage.getItem("exchanges");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist holdings to localStorage
  useEffect(() => {
    localStorage.setItem("holdings", JSON.stringify(holdings));
  }, [holdings]);

  // Persist trades to localStorage
  useEffect(() => {
    localStorage.setItem("trades", JSON.stringify(trades));
  }, [trades]);

  // Persist exchanges to localStorage
  useEffect(() => {
    localStorage.setItem("exchanges", JSON.stringify(exchanges));
  }, [exchanges]);

  // Add a new trade
  const addTrade = (trade) => {
    const newTrade = {
      ...trade,
      id: Date.now(),
    };
    setTrades((prev) => [newTrade, ...prev]);
    
    // Update holdings based on trade
    updateHoldingsFromTrade(newTrade);
  };

  // Update holdings based on trade
  const updateHoldingsFromTrade = (trade) => {
    setHoldings((prev) => {
      const existingIndex = prev.findIndex((h) => h.coinId === trade.coinId);

      if (existingIndex >= 0) {
        const updated = [...prev];
        const current = updated[existingIndex];

        if (trade.type === "BUY") {
          updated[existingIndex] = {
            ...current,
            quantity: current.quantity + trade.quantity,
          };
        } else {
          // SELL
          const newQuantity = current.quantity - trade.quantity;
          if (newQuantity <= 0) {
            // Remove if quantity is zero or negative
            updated.splice(existingIndex, 1);
          } else {
            updated[existingIndex] = {
              ...current,
              quantity: newQuantity,
            };
          }
        }
        return updated;
      } else if (trade.type === "BUY") {
        // Add new holding
        return [
          ...prev,
          {
            coinId: trade.coinId,
            symbol: trade.symbol,
            quantity: trade.quantity,
          },
        ];
      }
      return prev;
    });
  };

  // Add a new exchange
  const addExchange = (exchange) => {
    const newExchange = {
      ...exchange,
      id: Date.now(),
      connectedAt: new Date().toISOString(),
    };
    setExchanges((prev) => [...prev, newExchange]);
  };

  // Remove an exchange
  const removeExchange = (id) => {
    setExchanges((prev) => prev.filter((ex) => ex.id !== id));
  };

  // Delete a trade
  const deleteTrade = (id) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
  };

  // Calculate total cost basis for a holding
  const getCostBasis = (coinId) => {
    const relevantTrades = trades.filter((t) => t.coinId === coinId);
    
    let totalCost = 0;
    let totalQuantity = 0;

    relevantTrades.forEach((trade) => {
      if (trade.type === "BUY") {
        totalCost += trade.quantity * trade.price;
        totalQuantity += trade.quantity;
      } else {
        // For SELL, reduce proportionally
        const avgPrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;
        totalCost -= trade.quantity * avgPrice;
        totalQuantity -= trade.quantity;
      }
    });

    return totalQuantity > 0 ? totalCost / totalQuantity : 0;
  };

  const value = {
    holdings,
    setHoldings,
    trades,
    addTrade,
    deleteTrade,
    exchanges,
    addExchange,
    removeExchange,
    getCostBasis,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
};