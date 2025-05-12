import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
const fetchListOne = async <T,>(url: string): Promise<T> => {
  try {
    // Usamos getFullList para obtener todos los registros
    const records = await axiosInstance.get<T>(`${url}`);
    return records.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

// Hook personalizado para obtener listas
export const useGetOne = <T extends object>(url: string) => {
  return useQuery<T, Error>({
    queryKey: [`${url}`],
    queryFn: () => fetchListOne<T>(url),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
