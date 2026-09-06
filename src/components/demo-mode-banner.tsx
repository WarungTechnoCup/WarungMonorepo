import { Flask } from "@phosphor-icons/react/dist/ssr";

import { getServiceConfiguration } from "@/lib/env";

/**
 * DEMO_MODE existed as configuration but nothing ever branched on it, so a
 * demonstration deployment looked identical to a real one. Spec section 9
 * requires demo mode to be explicit; presenting synthetic prices as genuine
 * market data would be the most damaging thing this product could do.
 */
export function DemoModeBanner() {
  if (!getServiceConfiguration().demoMode) return null;

  return (
    <div className="bg-ink text-paper-strong">
      <p className="page-shell flex flex-wrap items-center gap-2 py-2 text-xs font-semibold">
        <Flask aria-hidden="true" size={16} weight="bold" />
        Mode demonstrasi aktif. Angka pada halaman ini berasal dari data contoh
        sintetis, bukan harga pasar sebenarnya.
      </p>
    </div>
  );
}
