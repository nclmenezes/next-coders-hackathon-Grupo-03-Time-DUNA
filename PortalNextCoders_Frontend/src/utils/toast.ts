import { toast } from "react-hot-toast";

interface ToastOptions {
  duration?: number;
  position?:
    | "top-left"
    | "top-right"
    | "top-center"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";
}

export function showNotFoundErrorToast(message: string, options: ToastOptions = {}) {
  return toast.error(message, {
    duration: options.duration ?? 5000,
    position: options.position ?? "top-center",
    style: {
      border: '1px solid #713200',
      padding: '16px',
      color: '#713200',
      width: '100%',
      height: '100%',
    },
    
  });
}

export function showLoginPasswordIncorrectToast(message: string, options: ToastOptions = {}) {
  return toast.error(message, {
    duration: options.duration ?? 3000,
    position: options.position ?? "top-center",
    style: {
      border: '1px solid #713200',
      padding: '35px',
      color: '#713200',
      width: '100%',
      height: '100%',
    },

  });
}

export function showErrorToast(message: string, options: ToastOptions = {}) {
  return toast.error(message, {
    duration: options.duration ?? 5000,
    position: options.position ?? "top-center",
  });
}

export function showInfoToast(message: string, options: ToastOptions = {}) {
    return toast(message, {
        duration: options.duration ?? 5000,
        position: options.position ?? "top-center",
    });
    }

export function showSuccessToast(message: string, options: ToastOptions = {}) {
  return toast.success(message, {
    duration: options.duration ?? 5000,
    position: options.position ?? "top-center",
  });
}

export function showLoadingToast(message: string, options: ToastOptions = {}) {
  return toast.loading(message, { position: options.position ?? "top-center" });
}

export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}
