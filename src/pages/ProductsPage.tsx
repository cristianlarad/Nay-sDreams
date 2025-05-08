"use client";

import { useState, useEffect } from "react";
import LoadingPage from "@/components/loadingPage";
import ProductCard from "@/components/products/productCard";
import ErrorPage from "./ErrorsPage";
import { useProductList } from "@/hooks/useList";
import PaginationControls from "@/components/paginationControl";
import ProductSearchInput from "@/components/ProductSearchInput";
import PriceFilter from "@/components/PRiceFilter";

const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const productsPerPage = 6;

  const { data, isLoading, error, isFetching } = useProductList(
    currentPage,
    productsPerPage,
    searchTerm,
    minPrice,
    maxPrice
  );

  useEffect(() => {
    if (searchTerm !== "" || minPrice !== undefined || maxPrice !== undefined) {
      setCurrentPage(1);
    }
  }, [searchTerm, minPrice, maxPrice]);

  if (isLoading && !data?.items.length && !error && !isFetching)
    return <LoadingPage />;
  if (error) return <ErrorPage message={error.message} />;

  const handleSearchChange = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
  };

  const handlePriceFiltersChange = (newPriceFilters: {
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setMinPrice(newPriceFilters.minPrice);
    setMaxPrice(newPriceFilters.maxPrice);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <ProductSearchInput
          initialSearchTerm={searchTerm}
          onSearchTermChange={handleSearchChange}
          debounceMs={300}
        />
        <PriceFilter
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          onFiltersChange={handlePriceFiltersChange}
        />
      </div>

      {isFetching && (
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
          Cargando productos...
        </div>
      )}

      {data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        !isFetching && (
          <div className="text-center py-10">
            <p className="text-xl text-slate-600 dark:text-slate-400">
              {searchTerm
                ? `No se encontraron productos para "${searchTerm}".`
                : "No se encontraron productos."}
            </p>
          </div>
        )
      )}

      {data && data.items.length > 0 && data.totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};

export default ProductsPage;
