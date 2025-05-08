import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";

// Función debounce
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

interface ProductSearchInputProps {
  initialSearchTerm?: string;
  onSearchTermChange: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const ProductSearchInput = ({
  initialSearchTerm = "",
  onSearchTermChange,
  placeholder = "Buscar productos por nombre...",
  debounceMs = 300, // 300ms de debounce por defecto
}: ProductSearchInputProps) => {
  const [inputValue, setInputValue] = useState(initialSearchTerm);

  // Usamos useCallback para la función debounced para que no se recree en cada render,
  // a menos que onSearchTermChange o debounceMs cambien.
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      onSearchTermChange(searchTerm);
    }, debounceMs),
    [onSearchTermChange, debounceMs]
  );

  useEffect(() => {
    // Si el initialSearchTerm cambia desde fuera, actualizamos el input
    // Esto es útil si el término de búsqueda puede ser reseteado o cambiado por otro componente.
    setInputValue(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setInputValue(newSearchTerm);
    debouncedSearch(newSearchTerm);
  };

  return (
    <Input
      type="search"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      className="max-w-sm"
    />
  );
};

export default ProductSearchInput;
