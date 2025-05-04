import { supabase } from "@/Db/supabaseClient";
import { IProducts } from "@/types/products";

// Define a type for the return value
export interface ProductResult {
  data: IProducts[] | null;
  isLoading: boolean;
  error: Error | null;
}

export const getProducts = async (): Promise<ProductResult> => {
  // Set initial loading state
  const result: ProductResult = {
    data: null,
    isLoading: true,
    error: null,
  };

  try {
    // Start loading
    result.isLoading = true;

    const { data, error } = await supabase.from("products").select("*");

    // Update result based on response
    if (error) {
      result.error = error;
      result.isLoading = false;
      throw error;
    }

    result.data = data;
    result.isLoading = false;

    return result;
  } catch (error) {
    console.error("Error fetching products:", error);

    // Ensure loading is set to false and error is captured
    result.isLoading = false;
    result.error = error instanceof Error ? error : new Error(String(error));

    return result;
  }
};
