import pb from "@/utils/instancePocketbase";
import { useQuery } from "@tanstack/react-query";

// Función genérica para obtener lista desde PocketBase
const fetchListOne = async <T,>(collection: string, id: string): Promise<T> => {
  try {
    // Usamos getFullList para obtener todos los registros
    const records = await pb.collection(collection).getOne<T>(id);
    return records;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    throw error;
  }
};

// Hook personalizado para obtener listas
export const useGetOne = <T extends object>(collection: string, id: string) => {
  return useQuery<T, Error>({
    queryKey: [`${collection}-${id}`],
    queryFn: () => fetchListOne<T>(collection, id),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
