export const resetInputState = (
  setPreview,
  setExtractedText,
  setCharge,
  setReceiptNumber,
  setIsCurrentReceiptValid,
  fileInputRef,
) => {
  setPreview(null);
  setExtractedText("");
  setCharge(0);
  setReceiptNumber("");
  setIsCurrentReceiptValid(false);
  // clear file name from input
  fileInputRef.current.value = "";
};
