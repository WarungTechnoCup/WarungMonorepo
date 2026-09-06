"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

/**
 * Network status is external state owned by the browser, not by React, so it
 * is read through a store subscription rather than mirrored into an effect.
 * The server snapshot assumes online, because navigator is not available
 * while rendering and an offline banner must never appear in static output.
 */
function subscribeToNetwork(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

function getNetworkSnapshot() {
  return !navigator.onLine;
}

function getServerNetworkSnapshot() {
  return false;
}

export function ServiceWorkerManager() {
  const offline = useSyncExternalStore(
    subscribeToNetwork,
    getNetworkSnapshot,
    getServerNetworkSnapshot,
  );
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const updateAccepted = useRef(false);
  const reloading = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    function onControllerChange() {
      // The first worker takes control through clients.claim() on a page that
      // is already correct. Reloading then would throw the visitor out of
      // whatever they were reading, so only reload for an accepted update.
      if (!updateAccepted.current || reloading.current) return;
      reloading.current = true;
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
    updateAccepted.current = true;
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
