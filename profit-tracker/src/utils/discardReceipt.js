import { resetInputState } from "./resetInputState";

export const discardReceipt = (setIsCurrentReceiptValid) => {
  resetInputState();
  setIsCurrentReceiptValid(false);
};
