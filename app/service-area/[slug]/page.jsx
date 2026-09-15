import ServiceAreaClient from "@/components/ServiceAreaClient";
import { publicAreaService } from "@/services/public-area.service";
import { slugifyAreaName, parseAreaSlug } from "@/hooks/usePublicAreas";

export async function generateMetadata({ params: paramsPromise, searchParams: searchParamsPromise }) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const slug = params?.slug;
  const queryId = searchParams?.id;

  let areaName = "Service Area";

  if (queryId) {
    try {
      const res = await publicAreaService.getAreaById(queryId);
      const fetched = res?.data?.area || res?.area || res?.data;
      if (fetched?.name) areaName = fetched.name;
    } catch {}
  }

  if (areaName === "Service Area" && slug) {
    const cleanKey = parseAreaSlug(slug);
    areaName = cleanKey
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return {
    title: `Dr.Prime PrimeHeal Pillow in ${areaName}`,
    description: `Experience cervical neck support, pressure-relieving memory foam, and cooler sleep in ${areaName}. Direct delivery with 30-night risk-free trial.`,
  };
}

export default async function ServiceAreaPage({ params: paramsPromise, searchParams: searchParamsPromise }) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const slug = params?.slug;
  const queryId = searchParams?.id;

  let area = null;

  // 1. Fetch by ID if available
  if (queryId) {
    try {
      const res = await publicAreaService.getAreaById(queryId);
      area = res?.data?.area || res?.area || res?.data || null;
    } catch (err) {
      console.error("Failed to fetch area by ID on server:", err?.message);
    }
  }

  // 2. Fetch by slug if not found by ID
  if (!area && slug) {
    try {
      const cleanKey = parseAreaSlug(slug);

      if (!isNaN(cleanKey) && Number.isInteger(Number(cleanKey))) {
        const res = await publicAreaService.getAreaById(cleanKey);
        area = res?.data?.area || res?.area || res?.data || null;
      }

      if (!area) {
        const areasRes = await publicAreaService.getAreas();
        const allAreas = areasRes?.data?.areas || areasRes?.areas || areasRes?.data || [];

        for (const parent of allAreas) {
          if (slugifyAreaName(parent.name) === cleanKey || parent.name?.toLowerCase() === cleanKey) {
            area = parent;
            break;
          }
          if (parent.children && parent.children.length > 0) {
            const childMatch = parent.children.find(
              (c) => slugifyAreaName(c.name) === cleanKey || c.name?.toLowerCase() === cleanKey
            );
            if (childMatch) {
              area = childMatch;
              break;
            }
          }
        }

        if (area?.id) {
          const fullRes = await publicAreaService.getAreaById(area.id);
          const fullArea = fullRes?.data?.area || fullRes?.area || fullRes?.data;
          if (fullArea) area = fullArea;
        }
      }
    } catch (err) {
      console.error("Failed to resolve area by slug on server:", err?.message);
    }
  }

  // 3. Fallback structure if area object not in DB
  if (!area && slug) {
    const cleanKey = parseAreaSlug(slug);
    const formattedName = cleanKey
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    area = {
      id: cleanKey,
      name: formattedName,
      parent_id: null,
      parent: null,
      children: [],
      is_fallback: true,
    };
  }

  return <ServiceAreaClient initialArea={area} slug={slug} queryId={queryId} />;
}
