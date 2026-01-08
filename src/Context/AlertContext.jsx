import { createContext, useContext, useState, useEffect } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  // Alerts state with localStorage persistence
  const [alerts, setAlerts] = useState(() => {
    try {
      const stored = localStorage.getItem("alerts");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Persist alerts to localStorage
  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  // Add a price alert
  const addPriceAlert = (coinId, targetPrice, condition = "above") => {
    const newAlert = {
      id: Date.now(),
      type: "PRICE",
      coinId,
      targetPrice: Number(targetPrice),
      condition, // 'above' or 'below'
      triggered: false,
      createdAt: new Date().toISOString(),
    };

    setAlerts((prev) => [...prev, newAlert]);
    showToast(`Price alert set for ${coinId.toUpperCase()}`, "success");
    return newAlert;
  };

  // Trigger an alert
  const triggerAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === id && !alert.triggered) {
          showToast(
            `🔔 ${alert.coinId.toUpperCase()} reached ₹${alert.targetPrice.toLocaleString()}!`,
            "alert"
          );
          return { ...alert, triggered: true, triggeredAt: new Date().toISOString() };
        }
        return alert;
      })
    );
  };

  // Delete an alert
  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    showToast("Alert deleted", "info");
  };

  // Reset a triggered alert
  const resetAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, triggered: false, triggeredAt: null } : alert
      )
    );
  };

  // Clear all triggered alerts
  const clearTriggeredAlerts = () => {
    setAlerts((prev) => prev.filter((alert) => !alert.triggered));
    showToast("Triggered alerts cleared", "info");
  };

  // Show toast notification
  const showToast = (message, type = "info") => {
    const toast = {
      id: Date.now(),
      message,
      type, // 'success', 'error', 'info', 'alert'
    };

    setToasts((prev) => [...prev, toast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5000);
  };

  // Remove a specific toast
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Get active (non-triggered) alerts
  const activeAlerts = alerts.filter((a) => !a.triggered);

  // Get triggered alerts
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  const value = {
    alerts,
    activeAlerts,
    triggeredAlerts,
    addPriceAlert,
    triggerAlert,
    deleteAlert,
    resetAlert,
    clearTriggeredAlerts,
    toasts,
    showToast,
    removeToast,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within AlertProvider");
  }
  return context;
};