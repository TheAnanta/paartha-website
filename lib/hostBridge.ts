"use client";

export interface PayResult { status: "success" | "failure"; paymentId: string; code?: string }

declare global {
  interface Window {
    flutter_inappwebview?: { callHandler(name: string, ...args: unknown[]): Promise<unknown> };
    PaarthaPay?: { postMessage(message: string): void };
  }
}

/** Tells the app that opened this page in a webview how the payment ended. In a normal browser nothing listens, so it does nothing. */
export function reportToHost(result: PayResult) {
  try {
    if (window.flutter_inappwebview) void window.flutter_inappwebview.callHandler("PaarthaPay", result);
    else window.PaarthaPay?.postMessage(JSON.stringify(result));
  } catch {
    /* the host isn't listening */
  }
}
