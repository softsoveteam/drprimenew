import PublicAreasClient from "@/components/PublicAreasClient";
import { publicAreaService } from "@/services/public-area.service";

export const metadata = {
  title: "Service Areas | Dr.Prime",
  description: "Explore regions, main cities, and local subareas where Dr.Prime delivery and support services are available.",
};

export default async function ServiceAreaIndexPage() {
  let initialAreas = [];
  try {
    const res = await publicAreaService.getAreas();
    initialAreas = res?.data?.areas || res?.areas || res?.data || [];
  } catch (err) {
    console.error("Failed to fetch initial areas on server:", err?.message);
  }

  return <PublicAreasClient initialAreas={initialAreas} />;
}
