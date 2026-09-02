"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import type { NormalizationSuccess } from "@/domain/harga-wajar/types";
import {
  defaultCoarseLocation,
  LocationSelector,
} from "@/components/location-selector";
import { fetchApi } from "@/lib/api-client";
import { formatRupiah } from "@/lib/format";
import type { PriceReportResultDto, ProductDto } from "@/types/harga-wajar";

interface PriceReportFormProps {
  initialProductId?: string;
}

const inputClass =
  "border-ink/15 text-ink mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base outline-none focus:border-[var(--accent)]";

export function PriceReportForm({ initialProductId }: PriceReportFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [productId, setProductId] = useState(initialProductId ?? "");
  const [packagingOptionId, setPackagingOptionId] = useState("");
  const [observedDate, setObservedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [quantityPackages, setQuantityPackages] = useState("1");
  const [grossPriceIdr, setGrossPriceIdr] = useState("");
  const [discountIdr, setDiscountIdr] = useState("0");
  const [deliveryFeeIdr, setDeliveryFeeIdr] = useState("0");
  const [paymentTerms, setPaymentTerms] = useState<"tunai" | "tempo">("tunai");
  const [supplierType, setSupplierType] = useState("distributor");
  const [area, setArea] = useState(defaultCoarseLocation);
  const [aggregationConsent, setAggregationConsent] = useState(false);
  const [preview, setPreview] = useState<NormalizationSuccess | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idempotencyKey = useRef<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId) ?? null,
    [productId, products],
  );
  const selectedPackage = selectedProduct?.packagingOptions.find(
    (item) => item.id === packagingOptionId,
  );

  useEffect(() => {
    fetchApi<ProductDto[]>("/api/products")
      .then((loadedProducts) => {
        setProducts(loadedProducts);
        const chosenProduct =
          loadedProducts.find((product) => product.id === initialProductId) ??
          loadedProducts[0];
        if (chosenProduct) {
          setProductId(chosenProduct.id);
          setPackagingOptionId(chosenProduct.packagingOptions[0]?.id ?? "");
        }
      })
      .catch((loadError: unknown) => {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Katalog produk tidak dapat dimuat.",
        );
      })
      .finally(() => setLoading(false));
  }, [initialProductId]);

  function payload() {
    return {
      productId,
      packagingOptionId,
      observedDate,
      quantityPackages: Number(quantityPackages),
      grossPriceIdr: Number(grossPriceIdr),
      discountIdr: Number(discountIdr),
      deliveryFeeIdr: Number(deliveryFeeIdr),
      paymentTerms,
      supplierType,
      ...area,
      aggregationConsent,
    };
  }

  async function prepareReview() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await fetchApi<NormalizationSuccess>(
        "/api/price-reports/preview-normalization",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload()),
        },
      );
      setPreview(result);
      setStep(4);
    } catch (previewError) {
      setError(
        previewError instanceof Error
          ? previewError.message
          : "Pratinjau normalisasi gagal.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReport() {
    setSubmitting(true);
    setError(null);
    const requestIdempotencyKey = idempotencyKey.current ?? crypto.randomUUID();
    idempotencyKey.current = requestIdempotencyKey;
    try {
      const result = await fetchApi<PriceReportResultDto>(
        "/api/price-reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": requestIdempotencyKey,
          },
          body: JSON.stringify(payload()),
        },
      );
      const parameters = new URLSearchParams({
        reference: result.reference,
        reportId: result.reportId,
        status: result.status,
        unitPriceIdr: String(result.normalization.unitPriceIdr),
        productName: selectedProduct?.name ?? "Produk",
      });
      router.push(`/lapor-harga/sukses?${parameters}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Laporan tidak dapat disimpan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = ["Produk", "Pembelian", "Privasi", "Tinjau"];

  return (
    <div className="page-shell py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="eyebrow">Kontribusi Harga</p>
        <h1 className="text-ink mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
          Laporkan harga kulakan.
        </h1>
        <p className="text-ink-muted mt-5 text-lg leading-8">
          Sistem menghitung harga per unit dasar. Identitas warung dan hubungan
          dengan pemasok tidak ditampilkan pada benchmark publik.
        </p>
      </div>

      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Tahapan laporan">
        {stepLabels.map((label, index) => {
          const number = index + 1;
          return (
            <li
              className={`rounded-xl border px-2 py-3 text-center text-xs font-semibold sm:text-sm ${
                number === step
                  ? "border-[var(--accent)] bg-[rgba(47,107,85,0.08)] text-[var(--accent)]"
                  : number < step
                    ? "border-ink/10 text-ink"
                    : "border-ink/10 text-ink-muted"
              }`}
              key={label}
            >
              {number}. {label}
            </li>
          );
        })}
      </ol>

      <section className="border-ink/12 bg-paper mt-6 rounded-3xl border p-6 sm:p-8">
        {loading ? <p role="status">Memuat katalog produk...</p> : null}

        {!loading && step === 1 ? (
          <div>
            <h2 className="text-ink text-2xl font-semibold">
              Pilih produk dan kemasan
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="report-product"
                >
                  Produk
                </label>
                <select
                  className={inputClass}
                  id="report-product"
                  onChange={(event) => {
                    const nextProduct = products.find(
                      (product) => product.id === event.target.value,
                    );
                    setProductId(event.target.value);
                    setPackagingOptionId(
                      nextProduct?.packagingOptions[0]?.id ?? "",
                    );
                  }}
                  value={productId}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="report-package"
                >
                  Kemasan
                </label>
                <select
                  className={inputClass}
                  id="report-package"
                  onChange={(event) => setPackagingOptionId(event.target.value)}
                  value={packagingOptionId}
                >
                  {selectedProduct?.packagingOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="text-ink text-2xl font-semibold">
              Masukkan detail pembelian
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="observed-date"
                >
                  Tanggal pembelian
                </label>
                <input
                  className={inputClass}
                  id="observed-date"
                  onChange={(event) => setObservedDate(event.target.value)}
                  required
                  type="date"
                  value={observedDate}
                />
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="quantity"
                >
                  Jumlah kemasan
                </label>
                <input
                  className={inputClass}
                  id="quantity"
                  min="1"
                  onChange={(event) => setQuantityPackages(event.target.value)}
                  required
                  type="number"
                  value={quantityPackages}
                />
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="gross-price"
                >
                  Harga kotor total
                </label>
                <input
                  className={inputClass}
                  id="gross-price"
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => setGrossPriceIdr(event.target.value)}
                  placeholder="118000"
                  required
                  type="number"
                  value={grossPriceIdr}
                />
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="discount"
                >
                  Diskon total
                </label>
                <input
                  className={inputClass}
                  id="discount"
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => setDiscountIdr(event.target.value)}
                  type="number"
                  value={discountIdr}
                />
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="delivery"
                >
                  Biaya kirim
                </label>
                <input
                  className={inputClass}
                  id="delivery"
                  inputMode="numeric"
                  min="0"
                  onChange={(event) => setDeliveryFeeIdr(event.target.value)}
                  type="number"
                  value={deliveryFeeIdr}
                />
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="payment-terms"
                >
                  Cara bayar
                </label>
                <select
                  className={inputClass}
                  id="payment-terms"
                  onChange={(event) =>
                    setPaymentTerms(event.target.value as "tunai" | "tempo")
                  }
                  value={paymentTerms}
                >
                  <option value="tunai">Tunai</option>
                  <option value="tempo">Tempo</option>
                </select>
              </div>
              <div>
                <label
                  className="text-ink text-sm font-semibold"
                  htmlFor="supplier-type"
                >
                  Jenis pemasok
                </label>
                <select
                  className={inputClass}
                  id="supplier-type"
                  onChange={(event) => setSupplierType(event.target.value)}
                  value={supplierType}
                >
                  <option value="distributor">Distributor</option>
                  <option value="grosir">Grosir</option>
                  <option value="agen">Agen</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>
            <div className="mt-5">
              <LocationSelector onChange={setArea} value={area} />
            </div>
            <p className="text-ink-muted mt-5 text-sm">
              {selectedPackage
                ? `Satu ${selectedPackage.label} berisi ${selectedPackage.unitsPerPackage} ${selectedPackage.baseUnit}.`
                : "Pilih kemasan yang valid."}
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 className="text-ink text-2xl font-semibold">
              Persetujuan agregasi
            </h2>
            <p className="text-ink-muted mt-4 leading-7">
              Harga, unit, waktu, dan wilayah administratif digunakan untuk
              membuat agregat anonim. Nama warung, email, alamat persis, struk,
              dan pemasok tidak diterbitkan.
            </p>
            <label className="border-ink/12 mt-6 flex cursor-pointer items-start gap-4 rounded-2xl border p-5">
              <input
                checked={aggregationConsent}
                className="mt-1 size-5"
                onChange={(event) =>
                  setAggregationConsent(event.target.checked)
                }
                type="checkbox"
              />
              <span className="text-ink text-sm leading-6">
                Saya setuju laporan ini digunakan untuk benchmark anonim sesuai
                kebijakan privasi versi 1.0.0.
              </span>
            </label>
            <p className="text-ink-muted mt-4 text-sm">
              Unggah struk belum diaktifkan sampai kebijakan penyimpanan privat
              dan penghapusan lolos pengujian akses lintas pengguna.
            </p>
          </div>
        ) : null}

        {step === 4 && preview ? (
          <div>
            <div className="flex items-center gap-3">
              <CheckCircle
                aria-hidden="true"
                className="text-accent"
                size={26}
                weight="fill"
              />
              <h2 className="text-ink text-2xl font-semibold">
                Tinjau hasil normalisasi
              </h2>
            </div>
            <dl className="border-ink/10 mt-6 grid gap-5 border-y py-6 sm:grid-cols-3">
              <div>
                <dt className="text-ink-muted text-sm">Total setelah biaya</dt>
                <dd className="text-ink mt-1 font-semibold">
                  {formatRupiah(preview.landedTotalIdr)}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-sm">Total unit dasar</dt>
                <dd className="text-ink mt-1 font-semibold">
                  {preview.baseUnitsTotal} {selectedProduct?.baseUnit}
                </dd>
              </div>
              <div>
                <dt className="text-ink-muted text-sm">Harga per unit</dt>
                <dd className="text-ink mt-1 text-2xl font-semibold">
                  {formatRupiah(preview.unitPriceIdr)}
                </dd>
              </div>
            </dl>
            <p className="text-ink-muted mt-5 text-sm">
              Formula: (harga kotor - diskon + biaya kirim) dibagi total unit.
              Versi {preview.calculationVersion}.
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="text-danger mt-6 text-sm" role="alert">
            {error}
          </p>
        ) : null}

        {!loading ? (
          <div className="border-ink/10 mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            {step > 1 ? (
              <button
                className="secondary-action justify-center"
                disabled={submitting}
                onClick={() => setStep((current) => current - 1)}
                type="button"
              >
                Kembali
              </button>
            ) : (
              <span />
            )}
            {step < 3 ? (
              <button
                className="primary-action justify-center"
                disabled={
                  (step === 1 && (!productId || !packagingOptionId)) ||
                  (step === 2 &&
                    (!grossPriceIdr || Number(quantityPackages) < 1))
                }
                onClick={() => setStep((current) => current + 1)}
                type="button"
              >
                Lanjutkan
              </button>
            ) : null}
            {step === 3 ? (
              <button
                className="primary-action justify-center disabled:opacity-60"
                disabled={!aggregationConsent || submitting}
                onClick={() => void prepareReview()}
                type="button"
              >
                {submitting ? "Menghitung..." : "Tinjau perhitungan"}
              </button>
            ) : null}
            {step === 4 ? (
              <button
                className="primary-action justify-center disabled:opacity-60"
                disabled={submitting}
                onClick={() => void submitReport()}
                type="button"
              >
                {submitting ? "Menyimpan..." : "Kirim laporan"}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
