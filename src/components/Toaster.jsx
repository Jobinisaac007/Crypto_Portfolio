import { useAlerts } from "../Context/AlertContext";
import { X, CheckCircle, AlertCircle, Info, Bell } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useAlerts();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      case "alert":
        return <Bell size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600 border-green-500";
      case "error":
        return "bg-red-600 border-red-500";
      case "alert":
        return "bg-yellow-600 border-yellow-500";
      default:
        return "bg-blue-600 border-blue-500";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg text-white animate-slide-in ${getStyles(
            toast.type
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-white/80 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}