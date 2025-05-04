import { IProduct } from "@/types/products";
import pb from "@/utils/instancePocketbase";
import { useQuery } from "@tanstack/react-query";

// Función genérica para obtener lista desde PocketBase
const fetchList = async <T,>(collection: string): Promise<T[]> => {
  try {
    // Usamos getFullList para obtener todos los registros
    const records = await pb.collection(collection).getFullList<T>();
    return records;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw error;
  }
};

// Hook personalizado para obtener listas
export const useList = <T extends object>(collection: string) => {
  return useQuery<T[], Error>({
    queryKey: [`${collection}-list`],
    queryFn: () => fetchList<T>(collection),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Hook específico para productos que envuelve la respuesta
export const useProductList = () => {
  const query = useList<IProduct>("products");
  return {
    ...query,
    data: {
      items: query.data || [],
      page: 1,
      perPage: query.data?.length || 0,
      totalItems: query.data?.length || 0,
      totalPages: 1,
    },
  };
};
