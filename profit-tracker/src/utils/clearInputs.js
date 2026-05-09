import { resetInputState } from "./resetInputState";
import { calculateProfit } from "./calculateProfit";
import { toastNotify } from "./toastNotify";

export const clearInputDetails = (isCurrentReceiptValid) => {
  if (isCurrentReceiptValid) {
    toastNotify.success("Receipt added successfully!");
    calculateProfit();
  }
  resetInputState();
};
