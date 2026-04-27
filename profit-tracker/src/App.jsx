import { useState, useRef } from "react";

//libs
import puter from "@heyputer/puter.js";

// utils
import { autoCropGCashReceipt } from "./utils/autoCrop";
import { extractReceiptData } from "./utils/regex";

const GcashOcrPro = () => {
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleProcess = async (e) => {
    const file = e.target.files?.[0] || fileInputRef.current.files[0];
    if (!file) return;

    setIsProcessing(true);
    setExtractedText("Cropping and reading receipt...");

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
      const formattedResult = `Reference No: ${receiptData.refNo}\nAmount: ${receiptData.amount}`;
      setExtractedText(formattedResult);
    } catch (error) {
      console.error("OCR Error:", error);
      setExtractedText("Error processing image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold mb-4 text-vivid-pink">
        GCash Smart Scan
      </h2>

      <div className="space-y-4">
        {/* Styled File Input */}
        <label className="block">
          <span className="sr-only">Choose receipt</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleProcess}
            accept="image/*"
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-vivid-pink hover:file:bg-pink-100 cursor-pointer"
          />
        </label>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-3 text-blue-500 font-medium animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Analyzing receipt...
          </div>
        )}

        {/* Smart Preview */}
        {preview && (
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-2">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2 text-center">
              Cropped Result
            </p>
            <img
              src={preview}
              alt="Cropped"
              className="w-full rounded shadow-sm"
            />
          </div>
        )}

        {/* Result Area */}
        <div className="mt-4">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Extracted Text
          </label>
          <div className="mt-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg min-h-[100px] text-sm whitespace-pre-wrap border border-slate-100 dark:border-slate-700">
            {extractedText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GcashOcrPro;
