export const extractReceiptData = (rawText) => {
  // 1. Clean the text: remove extra newlines and fix common OCR errors
  const cleanText = rawText.replace(/\n/g, " ").replace(/\s+/g, " ");

  // 2. Extract Reference Number (Look for 13 consecutive digits)

  // 1. Look for "Ref No" followed by digits and spaces
  // [\d\s]{11,18} allows for the spaces in "8038 221..."
  const refRegex = /(?:Ref\s?No\.?)\s?([\d\s]{11,20})/i;

  const refMatch = cleanText.match(refRegex);

  let refNo = "Not Found";

  if (refMatch) {
    // 2. Clean the match: remove spaces and any trailing non-digit characters
    // We turn "8038 221 889858" into "8038221889858"
    refNo = refMatch[1].replace(/\s/g, "").trim();

    // 3. (Optional) Final check: GCash refs are usually 13 digits
    // If it's longer (e.g., captured the date by mistake), slice it
    if (refNo.length > 13) {
      refNo = refNo.substring(0, 13);
    }
  }

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
