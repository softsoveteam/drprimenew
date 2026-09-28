import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Trigger a browser file download from a Blob/File. */
export function downloadBlob(blob, filename = "download.pdf") {
  if (!(blob instanceof Blob)) {
    throw new Error("Download failed: invalid file response");
  }

  // API sometimes returns JSON errors as a blob
  if (blob.type && blob.type.includes("application/json")) {
    return blob.text().then((text) => {
      let message = "Download failed";
      try {
        message = JSON.parse(text)?.message || message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    });
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return Promise.resolve();
}

/** True when an order can download its invoice PDF. */
export function orderHasInvoice(order) {
  if (!order) return false;
  if (order.status !== "paid") return false;
  // Paid orders always support invoice download; API regenerates if missing
  return true;
}

