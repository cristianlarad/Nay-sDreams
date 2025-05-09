import { IProduct } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Import axios

// Define a generic paginated response type, adjust if your backend differs
export interface PaginatedResponse<T> {
  products: T[];
  totalItems: number;
  totalPages: number;
  page: number;
  perPage: number;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL; // Example: http://localhost:8080/api

// Función genérica para obtener lista paginada desde el backend Go
const fetchList = async <T,>(
  collection: string,
  page: number,
  perPage: number,
  filterTerm?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<PaginatedResponse<T>> => {
  try {
    const params: Record<string, unknown> = {
      page,
      perPage,
    };

    if (filterTerm && filterTerm.trim() !== "") {
      params.search = filterTerm; // Assuming 'search' is the query param for filterTerm
    }
    if (minPrice !== undefined) {
      params.minPrice = minPrice;
    }
    if (maxPrice !== undefined) {
      params.maxPrice = maxPrice;
    }

    // Construct the URL for the collection endpoint
    // Example: http://localhost:8080/api/products
    const response = await axios.get<PaginatedResponse<T>>(
      `${API_BASE_URL}/${collection}`,
      {
        params,
      }
    );
    return response.data; // Axios wraps the response in a data property
  } catch (error) {
    console.error(`Error fetching paginated ${collection}:`, error);
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors if needed
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

// Hook personalizado para obtener listas paginadas
export const useList = <T extends object>(
  collection: string,
  page: number,
  perPage: number,
  filterTerm?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  return useQuery<PaginatedResponse<T>, Error>({
    queryKey: [
      `${collection}-list`,
      page,
      perPage,
      filterTerm,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      fetchList<T>(collection, page, perPage, filterTerm, minPrice, maxPrice),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook específico para productos que envuelve la respuesta paginada
export const useProductList = (
  page: number,
  perPage: number,
  filterTerm?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const query = useList<IProduct>(
    "product", // This will be part of the URL, e.g., /api/products
    page,
    perPage,
    filterTerm,
    minPrice,
    maxPrice
  );

  // query.data será de tipo PaginatedResponse<IProduct> | undefined
  // Si query.data es undefined (cargando/error), proveer una estructura por defecto
  return {
    ...query,
    data: query.data ?? {
      products: [],
      page: page,
      perPage: perPage,
      totalItems: 0,
      totalPages: 1, // Ensure totalPages is at least 1 to prevent division by zero issues
    },
  };
};
