export interface CoarseLocation {
  province: string;
  city: string;
  district: string;
}

interface LocationSelectorProps {
  onChange: (location: CoarseLocation) => void;
  value: CoarseLocation;
}

export const defaultCoarseLocation: CoarseLocation = {
  province: "DKI Jakarta",
  city: "Jakarta Barat",
  district: "Kebon Jeruk",
};

const inputClass =
  "border-ink/15 text-ink mt-2 min-h-11 w-full rounded-xl border bg-white px-3 text-base outline-none focus:border-[var(--accent)]";

export function LocationSelector({ onChange, value }: LocationSelectorProps) {
  function update(field: keyof CoarseLocation, nextValue: string) {
    onChange({ ...value, [field]: nextValue });
  }

  return (
    <fieldset className="grid gap-3 sm:grid-cols-3">
      <legend className="text-ink text-sm font-semibold">
        Area pembanding
      </legend>
      <label className="text-ink text-sm" htmlFor="province">
        Provinsi
        <input
          className={inputClass}
          id="province"
          minLength={2}
          onChange={(event) => update("province", event.target.value)}
          required
          value={value.province}
        />
      </label>
      <label className="text-ink text-sm" htmlFor="city">
        Kota atau kabupaten
        <input
          className={inputClass}
          id="city"
          minLength={2}
          onChange={(event) => update("city", event.target.value)}
          required
          value={value.city}
        />
      </label>
      <label className="text-ink text-sm" htmlFor="district">
        Kecamatan
        <input
          className={inputClass}
          id="district"
          minLength={2}
          onChange={(event) => update("district", event.target.value)}
          required
          value={value.district}
        />
      </label>
    </fieldset>
  );
}
