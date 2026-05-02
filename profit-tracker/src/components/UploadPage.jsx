import { useState, useRef, useEffect } from "react";

//libs
import puter from "@heyputer/puter.js";

// utils
import { autoCropGCashReceipt } from "../utils/autoCrop";
import { extractReceiptData } from "../utils/regex";
import { autoScrollToDetails } from "../utils/autoScroll";

const UploadPage = () => {
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [extracting, setExtracting] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const detailsRef = useRef(null);

  const GcashNumberOwner = "+63 975 596 1986";

  const handleProcess = async (e) => {
    const file = e.target.files?.[0] || fileInputRef.current.files[0];
    if (!file) return;

    setIsProcessing(true);
    autoScrollToDetails(detailsRef);
    setExtracting("Cropping and reading receipt...");

    try {
      // 1. Run the Smart Crop
      // This returns a Blob of just the white receipt area
      const croppedBlob = await autoCropGCashReceipt(file);

      // 2. Create preview for the UI
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setPreview(croppedUrl);

      // 3. Convert Blob to DataURL for Puter.js
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(croppedBlob);
      });

      // 4. Send the CLEAN image to Puter AI
      const text = await puter.ai.img2txt(dataUrl);

      const receiptData = extractReceiptData(text);
      console.log(receiptData);
      const formattedResult = `Reference No: ${receiptData.refNo}\nAmount: ${receiptData.amount}\n${receiptData.phoneNo == GcashNumberOwner ? "Cash out" : "Cash In"}`;
      setExtractedText(formattedResult);
    } catch (error) {
      console.error("OCR Error:", error);
      setExtractedText("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    autoScrollToDetails(detailsRef);
  }, [extractedText]);

  return (
    <>
      <header className="flex p-2">
        <div className="border border-gray-300 rounded-full p-2">
          <img src="public/profit.png" alt="favicon" width={24} />
        </div>
      </header>

      <div className="p-2">
        <div className="p-4 max-w-lg mx-auto dark:bg-slate-900 shadow-xl rounded-md border">
          <div className="space-y-4">
            {/* Styled File Input */}
            <label className="block">
              <span className="sr-only">Upload receipt</span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProcess}
                accept="image/*"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-vivid-pink hover:file:bg-blue-100 cursor-pointer"
              />
            </label>

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 text-blue-500 font-medium animate-pulse">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Analyzing receipt...
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-2">
                <img
                  src={preview}
                  alt="Cropped"
                  className="w-full rounded shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
        {/* Result Area */}
        <div className="mt-4 mb-4">
          <label className="text-xs font-bold text-slate-500 uppercase">
            {isProcessing ? extracting : "Details"}
          </label>
          <div className="mt-1 p-3 min-h-15 rounded-lg text-sm whitespace-pre-wrap border border-slate-100 dark:border-slate-700 font-extralight">
            {extractedText ||
              "Upload a GCash receipt to see the extracted details here."}
          </div>
        </div>

        <div
          ref={detailsRef}
          className="flex justify-center p-4 border border-gray-300 rounded-md mb-4 bg-green-400 text-white font-medium cursor-pointer hover:bg-green-500 transition"
        >
          <button>Add</button>
        </div>

        <div className="flex justify-center p-2">
          <button>Add Manually</button>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
