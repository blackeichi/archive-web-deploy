export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export function useToast() {
  const toasts = useState<ToastItem[]>("toasts", () => []);

  function showToast({
    message,
    type = "info",
    duration = 3000,
  }: {
    message: string;
    type?: ToastType;
    duration?: number;
  }) {
    const id = crypto.randomUUID();

    toasts.value.push({
      id,
      message,
      type,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  function success(message: string, duration = 3000) {
    showToast({ message, type: "success", duration });
  }

  function error(message: string, duration = 3000) {
    showToast({ message, type: "error", duration });
  }

  function info(message: string, duration = 3000) {
    showToast({ message, type: "info", duration });
  }

  function warning(message: string, duration = 3000) {
    showToast({ message, type: "warning", duration });
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };
}
