import toast from "react-hot-toast";

export const toastNotify = {
  // Internal helper to keep styles consistent
  _show: (type, msg, color) => {
    toast[type](msg, {
      style: {
        border: `1px solid ${color}`,
        color: color,
      },
    });
  },

  error: (msg) => toastNotify._show("error", msg, "red"),
  success: (msg) => toastNotify._show("success", msg, "green"),
};
