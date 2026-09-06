"use client";

import { useCallback, useEffect, useState } from "react";

export function ServiceWorkerManager() {
  const [offline, setOffline] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    setOffline(!navigator.onLine);

    function goOnline() {
      setOffline(false);
    }
    function goOffline() {
      setOffline(true);
    }

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reloading = false;
    function onControllerChange() {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    }

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    void navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        if (registration.waiting) {
          setWaiting(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            // Only prompt when this replaces a worker already in control,
            // otherwise it is the very first install and nothing changed.
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setWaiting(installing);
            }
          });
        });
      })
      .catch(() => undefined);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  const applyUpdate = useCallback(() => {
    waiting?.postMessage("SKIP_WAITING");
    setWaiting(null);
  }, [waiting]);

  if (!offline && !waiting) return null;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 px-4 md:bottom-4">
      <div className="border-ink/15 bg-paper-strong mx-auto flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg">
        {offline ? (
          <p className="text-ink text-sm font-semibold" role="status">
            Anda sedang offline. Angka yang tampil berasal dari data tersimpan
            terakhir.
          </p>
        ) : (
          <>
            <p className="text-ink text-sm font-semibold">
              Versi baru tersedia.
            </p>
            <button
              className="primary-action"
              onClick={applyUpdate}
              type="button"
            >
              Muat ulang
            </button>
          </>
        )}
      </div>
    </div>
  );
}
