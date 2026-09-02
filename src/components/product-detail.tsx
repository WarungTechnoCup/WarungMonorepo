"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BenchmarkCard } from "@/components/benchmark-card";
import { fetchApi } from "@/lib/api-client";
import type { BenchmarkDto, ProductDto } from "@/types/harga-wajar";

export function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [benchmark, setBenchmark] = useState<BenchmarkDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<ProductDto>(`/api/products/${encodeURIComponent(slug)}`)
      .then(async (loadedProduct) => {
        setProduct(loadedProduct);
        const parameters = new URLSearchParams({
          productId: loadedProduct.id,
          province: "DKI Jakarta",
          city: "Jakarta Barat",
          district: "Kebon Jeruk",
          windowDays: "30",
        });
        setBenchmark(
          await fetchApi<BenchmarkDto>(`/api/benchmarks?${parameters}`),
        );
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Detail produk tidak dapat dimuat.",
        );
      });
  }, [slug]);

  if (error) {
    return (
      <div className="page-shell py-20">
        <h1 className="text-ink text-4xl font-semibold">
          Produk tidak tersedia
        </h1>
        <p className="text-ink-muted mt-4">{error}</p>
        <Link className="secondary-action mt-6" href="/cek-harga">
          Kembali ke pencarian
        </Link>
      </div>
    );
  }

  if (!product || !benchmark) {
    return (
      <div className="page-shell py-20" role="status">
        <h1 className="text-ink text-4xl font-semibold">
          Memuat detail produk
        </h1>
        <p className="text-ink-muted mt-4">
          Menyiapkan benchmark dan metodologi...
        </p>
      </div>
    );
  }

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <p className="eyebrow">Detail produk</p>
          <h1 className="text-ink mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
            {product.name}
          </h1>
          <p className="text-ink-muted mt-5 text-lg leading-8">
            {product.description}
          </p>
          <dl className="border-ink/10 mt-8 space-y-4 border-y py-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Merek</dt>
              <dd className="text-ink font-semibold">{product.brand}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Unit pembanding</dt>
              <dd className="text-ink font-semibold">per {product.baseUnit}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Kemasan didukung</dt>
              <dd className="text-ink text-right font-semibold">
                {product.packagingOptions.map((item) => item.label).join(", ")}
              </dd>
            </div>
          </dl>
          <Link
            className="primary-action mt-7 justify-center sm:inline-flex"
            href={`/lapor-harga?productId=${product.id}`}
          >
            Laporkan harga produk ini
          </Link>
        </section>

        <div>
          <BenchmarkCard benchmark={benchmark} />
          <section className="border-ink/12 mt-6 rounded-3xl border p-6">
            <h2 className="text-ink text-xl font-semibold">Cara menghitung</h2>
            <p className="text-ink-muted mt-3 leading-7">
              Harga kotor dikurangi diskon, ditambah biaya kirim, lalu dibagi
              jumlah unit dasar. Median dipakai agar satu harga ekstrem tidak
              mengubah patokan area secara berlebihan.
            </p>
            <p className="text-ink-muted mt-3 text-sm leading-6">
              Laporan duplikat dan anomali ditandai. Identitas warung, alamat
              persis, struk, dan hubungan dengan pemasok tidak diterbitkan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
