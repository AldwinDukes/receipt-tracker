export const extractReceiptData = (rawText) => {
  // 1. Clean the text: remove extra newlines and fix common OCR errors
  const cleanText = rawText.replace(/\n/g, " ").replace(/\s+/g, " ");

  // 2. Extract Reference Number (Look for 13 consecutive digits)
  // Pattern: Finds a string of 11 to 13 digits
  const refMatch = cleanText.match(/\b\d{11,13}\b/);
  const refNo = refMatch ? refMatch[0] : "Not Found";

  // 3. Extract Amount
  // Pattern: Finds digits that follow "Amount" or "Sent" or have a P/PHP symbol
  // It handles commas like 1,000.00
  const amountMatch =
    cleanText.match(/(?:Amount|Total|PHP|P)\s?([\d,]+\.\d{2})/i) ||
    cleanText.match(/([\d,]+\.\d{2})/);
  const amount = amountMatch ? amountMatch[1].replace(/,/g, "") : "0.00";

  // 4. Extract Recipient Name
  // Usually the first few words or words before a phone number
  // This is the hardest part and depends on your OCR's quality
  const nameMatch = cleanText.match(/^(.*?)(?=\s\+63|\ssent)/i);
  const name = nameMatch ? nameMatch[1].trim() : "Unknown User";

  return {
    refNo,
    amount: parseFloat(amount),
    name,
    raw: cleanText, // Keeping raw for debugging
  };
};
