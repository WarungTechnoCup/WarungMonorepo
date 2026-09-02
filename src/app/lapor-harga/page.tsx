import { PriceReportForm } from "@/components/price-report-form";

interface ReportPricePageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function ReportPricePage({
  searchParams,
}: ReportPricePageProps) {
  const { productId } = await searchParams;
  return <PriceReportForm initialProductId={productId} />;
}
