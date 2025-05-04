import LoadingPage from "@/components/loadingPage";
import ProductCard from "@/components/products/productCard";

import ErrorPage from "./ErrorsPage";
import { useProductList } from "@/hooks/useList";

const ProductsPage = () => {
  const { data, isLoading, error } = useProductList();

  console.log(data);

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage message={error.message} />;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
        {data?.items?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
