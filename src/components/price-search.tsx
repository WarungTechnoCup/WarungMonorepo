"use client";

import { MagnifyingGlass } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { BenchmarkCard } from "@/components/benchmark-card";
import {
  defaultCoarseLocation,
  LocationSelector,
} from "@/components/location-selector";
import { fetchApi } from "@/lib/api-client";
import type { BenchmarkDto, ProductDto } from "@/types/harga-wajar";

export function PriceSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null,
  );
  const [benchmark, setBenchmark] = useState<BenchmarkDto | null>(null);
  const [area, setArea] = useState(defaultCoarseLocation);
  const [windowDays, setWindowDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchApi<ProductDto[]>(
        `/api/products?query=${encodeURIComponent(search)}`,
      );
      setProducts(result);
      setSelectedProduct((current) => current ?? result[0] ?? null);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Produk tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchApi<ProductDto[]>("/api/products")
      .then((result) => {
        if (!active) return;
        setProducts(result);
        setSelectedProduct(result[0] ?? null);
        if (result.length === 0) setLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Produk tidak dapat dimuat.",
        );
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    const parameters = new URLSearchParams({
      productId: selectedProduct.id,
      ...area,
      windowDays: String(windowDays),
    });
    fetchApi<BenchmarkDto>(`/api/benchmarks?${parameters}`)
      .then(setBenchmark)
      .catch((loadError: unknown) => {
        setBenchmark(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Benchmark tidak dapat dimuat.",
        );
      })
      .finally(() => setLoading(false));
  }, [area, selectedProduct, windowDays]);

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Harga Wajar</p>
        <h1 className="text-ink mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
          Bandingkan harga kulakan dengan data area.
        </h1>
        <p className="text-ink-muted mt-6 text-lg leading-8">
          Cari produk, pilih periode, lalu lihat patokan yang hanya diterbitkan
          setelah lima warung independen berkontribusi.
        </p>
      </div>

      <form
        className="border-ink/12 bg-paper mt-10 flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          void loadProducts(query);
        }}
      >
        <label className="sr-only" htmlFor="product-query">
          Cari produk
        </label>
        <input
          className="border-ink/15 text-ink min-h-12 flex-1 rounded-xl border bg-white px-4 text-base outline-none focus:border-[var(--accent)]"
          id="product-query"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Contoh: Indomie atau minyak goreng"
          value={query}
        />
        <button className="primary-action justify-center" type="submit">
          <MagnifyingGlass aria-hidden="true" size={19} weight="bold" />
          Cari produk
        </button>
      </form>

      <div className="border-ink/12 bg-paper mt-4 rounded-2xl border p-4">
        <LocationSelector onChange={setArea} value={area} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-ink text-xl font-semibold">Hasil produk</h2>
            <span className="text-ink-muted text-sm">
              {products.length} produk
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {products.map((product) => (
              <button
                className={`min-h-20 w-full rounded-2xl border p-4 text-left transition ${
                  selectedProduct?.id === product.id
                    ? "border-[var(--accent)] bg-[rgba(47,107,85,0.08)]"
                    : "border-ink/12 bg-paper hover:border-ink/30"
                }`}
                key={product.id}
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setSelectedProduct(product);
                }}
                type="button"
              >
                <span className="text-ink block font-semibold">
                  {product.name}
                </span>
                <span className="text-ink-muted mt-1 block text-sm">
                  {product.brand} · dasar per {product.baseUnit}
                  {product.isDemo ? " · Data demo" : ""}
                </span>
              </button>
            ))}
            {!loading && products.length === 0 ? (
              <p className="border-ink/12 text-ink-muted rounded-2xl border p-5">
                Produk belum ditemukan. Coba nama atau merek yang lebih umum.
              </p>
            ) : null}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-ink text-xl font-semibold">
                {selectedProduct?.name ?? "Pilih produk"}
              </h2>
              <p className="text-ink-muted mt-1 text-sm">
                {area.district}, {area.city}
              </p>
            </div>
            <select
              aria-label="Periode benchmark"
              className="border-ink/15 text-ink min-h-11 rounded-xl border bg-white px-3"
              onChange={(event) => {
                setLoading(true);
                setError(null);
                setWindowDays(Number(event.target.value));
              }}
              value={windowDays}
            >
              <option value={30}>30 hari</option>
              <option value={90}>90 hari</option>
            </select>
          </div>

          {loading ? (
            <div
              className="border-ink/12 text-ink-muted rounded-3xl border p-8"
              role="status"
            >
              Memuat data harga...
            </div>
          ) : null}
          {error ? (
            <div
              className="border-danger/30 bg-danger/5 text-ink rounded-3xl border p-6"
              role="alert"
            >
              <p className="font-semibold">Data belum dapat ditampilkan</p>
              <p className="text-ink-muted mt-2 text-sm">{error}</p>
              <button
                className="secondary-action mt-4"
                onClick={() => void loadProducts(query)}
                type="button"
              >
                Coba lagi
              </button>
            </div>
          ) : null}
          {!loading && !error && benchmark ? (
            <>
              <BenchmarkCard benchmark={benchmark} />
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="primary-action justify-center"
                  href={`/lapor-harga?productId=${selectedProduct?.id ?? ""}`}
                >
                  Laporkan harga kamu
                </Link>
                {selectedProduct ? (
                  <Link
                    className="secondary-action justify-center"
                    href={`/produk/${selectedProduct.slug}`}
                  >
                    Lihat detail produk
                  </Link>
                ) : null}
              </div>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
