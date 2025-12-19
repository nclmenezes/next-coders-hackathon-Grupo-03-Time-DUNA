import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (message: string) => {
  toast.success(message, defaultOptions);
};

export const showErrorToast = (message: string) => {
  toast.error(message, defaultOptions);
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, defaultOptions);
};

export const dismissToast = (toastId: any) => {
  toast.dismiss(toastId);
};

export const showNotFoundErrorToast = (message: string) => {
  toast.error(message, defaultOptions);
};
