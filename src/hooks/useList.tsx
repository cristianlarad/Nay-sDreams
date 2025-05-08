import { IProduct } from "@/types/products";
import pb from "@/utils/instancePocketbase";
import { useQuery } from "@tanstack/react-query";
import type { ListResult } from "pocketbase";

// Función genérica para obtener lista paginada desde PocketBase
const fetchList = async <T,>(
  collection: string,
  page: number,
  perPage: number,
  filterTerm?: string,
  minPrice?: number, // Added minPrice
  maxPrice?: number // Added maxPrice
): Promise<ListResult<T>> => {
  try {
    const filterParts: string[] = [];
    if (filterTerm && filterTerm.trim() !== "") {
      // Escape single quotes for PocketBase filter
      const escapedFilterTerm = filterTerm.replace(/'/g, "''");
      filterParts.push(`title ~ '${escapedFilterTerm}'`);
    }
    if (minPrice !== undefined) {
      filterParts.push(`price >= ${minPrice}`);
    }
    if (maxPrice !== undefined) {
      filterParts.push(`price <= ${maxPrice}`);
    }

    const filterOptions: { filter?: string } = {};
    if (filterParts.length > 0) {
      filterOptions.filter = filterParts.join(" && ");
    }

    // Usamos getList para obtener registros paginados
    const records = await pb
      .collection(collection)
      .getList<T>(page, perPage, filterOptions);
    return records;
  } catch (error) {
    console.error(`Error fetching paginated ${collection}:`, error);
    throw error;
  }
};

// Hook personalizado para obtener listas paginadas
export const useList = <T extends object>(
  collection: string,
  page: number,
  perPage: number,
  filterTerm?: string,
  minPrice?: number, // Added minPrice
  maxPrice?: number // Added maxPrice
) => {
  return useQuery<ListResult<T>, Error>({
    queryKey: [
      `${collection}-list`,
      page,
      perPage,
      filterTerm,
      minPrice,
      maxPrice,
    ], // Added minPrice and maxPrice to queryKey
    queryFn: () =>
      fetchList<T>(collection, page, perPage, filterTerm, minPrice, maxPrice), // Pass to fetchList
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook específico para productos que envuelve la respuesta paginada
export const useProductList = (
  page: number,
  perPage: number,
  filterTerm?: string,
  minPrice?: number, // Added minPrice
  maxPrice?: number // Added maxPrice
) => {
  // Pass minPrice and maxPrice to useList
  const query = useList<IProduct>(
    "products",
    page,
    perPage,
    filterTerm,
    minPrice,
    maxPrice
  );

  // query.data será de tipo ListResult<IProduct> | undefined
  // Si query.data es undefined (cargando/error), proveer una estructura por defecto
  return {
    ...query,
    data: query.data ?? {
      items: [],
      page: page,
      perPage: perPage,
      totalItems: 0,
      totalPages: 1,
    },
  };
};
