import ProductPage from "@/components/ProductPage";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, productSchema } from "@/lib/seo";

export const metadata = pageMetadata("product");

export default function ProductRoute() {
  return (
    <>
      <JsonLd data={productSchema()} />
      <ProductPage />
    </>
  );
}
