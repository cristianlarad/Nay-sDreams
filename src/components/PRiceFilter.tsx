import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";

// Debounce function
function debounce<T, Args extends unknown[]>(
  func: (...args: Args) => T,
  waitFor: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced as (...args: Args) => void;
}

interface PriceFilterProps {
  initialMinPrice?: number;
  initialMaxPrice?: number;
  onFiltersChange: (filters: { minPrice?: number; maxPrice?: number }) => void;
  debounceMs?: number;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  initialMinPrice,
  initialMaxPrice,
  onFiltersChange,
  debounceMs = 300, // Default debounce time
}) => {
  const [minPrice, setMinPriceState] = useState<string>(
    initialMinPrice?.toString() || ""
  );
  const [maxPrice, setMaxPriceState] = useState<string>(
    initialMaxPrice?.toString() || ""
  );

  // Effect to update internal state if initial props change (e.g., from a global reset)
  useEffect(() => {
    setMinPriceState(initialMinPrice?.toString() || "");
  }, [initialMinPrice]);

  useEffect(() => {
    setMaxPriceState(initialMaxPrice?.toString() || "");
  }, [initialMaxPrice]);

  const debouncedOnFiltersChange = useCallback(
    debounce((filters: { minPrice?: number; maxPrice?: number }) => {
      onFiltersChange(filters);
    }, debounceMs),
    [onFiltersChange, debounceMs]
  );

  // Effect to call debouncedOnFiltersChange when minPrice or maxPrice state changes
  useEffect(() => {
    const numericMinPrice = minPrice === "" ? undefined : parseFloat(minPrice);
    const numericMaxPrice = maxPrice === "" ? undefined : parseFloat(maxPrice);

    debouncedOnFiltersChange({
      minPrice: isNaN(numericMinPrice!) ? undefined : numericMinPrice,
      maxPrice: isNaN(numericMaxPrice!) ? undefined : numericMaxPrice,
    });
  }, [minPrice, maxPrice, debouncedOnFiltersChange]);

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinPriceState(event.target.value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPriceState(event.target.value);
  };

  return (
    <div className="flex ml-4 items-center space-x-4">
      <Input
        id="min-price"
        type="number"
        placeholder="Mín."
        value={minPrice}
        onChange={handleMinPriceChange}
        className="w-28"
        min="0"
      />

      <Input
        id="max-price"
        type="number"
        placeholder="Máx."
        value={maxPrice}
        onChange={handleMaxPriceChange}
        className="w-28"
        min="0"
      />
    </div>
  );
};

export default PriceFilter;
