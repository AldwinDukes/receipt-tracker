export const autoCropGCashReceipt = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 1. Get the reference Blue Color from (0,0)
        const topPixel = ctx.getImageData(0, 0, 1, 1).data;
        const refR = topPixel[0];
        const refG = topPixel[1];
        const refB = topPixel[2];

        // 2. Scan for the Top Edge of the white receipt
        let topEdgeY = 0;
        //let isTopFound = false;
        // We scan only the central column of pixels for speed
        for (let y = 0; y < img.height; y++) {
          const pixel = ctx.getImageData(img.width / 2, y, 1, 1).data;
          // Calculate 'Color Distance' from the reference blue
          const diff =
            Math.abs(pixel[0] - refR) +
            Math.abs(pixel[1] - refG) +
            Math.abs(pixel[2] - refB);

          // Tolerance threshold (if color difference is > 60, it's not the blue background)
          if (diff > 60) {
            topEdgeY = y;
            //isTopFound = true;
            break;
          }
        }

        // 3. Scan upward for the Bottom Edge (optional - avoids Green area if needed)
        // If you don't care about the Green area, you can skip this and set height to img.height - topEdgeY
        let bottomEdgeY = img.height;
        for (let y = img.height - 1; y > topEdgeY; y--) {
          const pixel = ctx.getImageData(img.width / 2, y, 1, 1).data;
          const diff =
            Math.abs(pixel[0] - refR) +
            Math.abs(pixel[1] - refG) +
            Math.abs(pixel[2] - refB);
          if (diff > 60) {
            bottomEdgeY = y;
            break;
          }
        }

        // Calculate the actual receipt height
        const receiptHeight = bottomEdgeY - topEdgeY;

        // 4. Create the Cropped Canvas
        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");
        croppedCanvas.width = img.width;
        croppedCanvas.height = receiptHeight;

        // Redraw only the selected area onto the new canvas
        croppedCtx.drawImage(
          img,
          0,
          topEdgeY,
          img.width,
          receiptHeight, // Source (sx, sy, sw, sh)
          0,
          0,
          img.width,
          receiptHeight, // Destination (dx, dy, dw, dh)
        );

        // 5. Convert to Blob (Final Optimized file)
        croppedCanvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.85,
        ); // 0.85 quality is good balance
      };
    };
  });
};
