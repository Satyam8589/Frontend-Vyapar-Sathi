"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ProductAnalyticsContent,
  useProductAnalytics,
} from "@/features/productAnalytics";

const ProductAnalyticsPage = () => {
  const params = useParams();
  const router = useRouter();
  const analytics = useProductAnalytics(params.storeId, params.productId);

  return (
    <ProductAnalyticsContent
      analytics={analytics}
      onBack={() => router.back()}
    />
  );
};

export default ProductAnalyticsPage;
