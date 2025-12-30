import { ProductFormValues } from "@/lib/schemas/productForm.schema";
import { CategoryType, ProductInfoData } from "@/types/Product";

export function transformToFormValues(data: ProductInfoData): ProductFormValues {
  const formatDateTimeLocal = (isoString: string | null | undefined) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 16);
  };

  const categoryData = data.category as { name: string } | { name: string }[];
  const categoryName = Array.isArray(categoryData) ? categoryData[0]?.name : categoryData?.name;
  return {
    name: data.name,
    image: data.image ?? null,
    price: data.price,
    category: (categoryName?.toUpperCase() || "TOP") as CategoryType,
    sizes: data.stocks.map((s) => s.size.name.toUpperCase()),
    stocks: data.stocks.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.size.name.toUpperCase()] = curr.quantity;
      return acc;
    }, {}),

    discount: {
      enabled: data.discountRate > 0,
      value: data.discountRate > 0 ? data.discountRate : null,
      periodEnabled: !!(data.discountStartTime && data.discountEndTime),
      periodStart: formatDateTimeLocal(data.discountStartTime),
      periodEnd: formatDateTimeLocal(data.discountEndTime),
    },
    detail: data.content,
  };
}
