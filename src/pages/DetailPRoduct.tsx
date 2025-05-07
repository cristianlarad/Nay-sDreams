"use client";

import { useState } from "react";
import { useGetOne } from "@/hooks/useGetOne";
import type { IProduct } from "@/types/products";
import { FormatCurrency } from "@/utils/FormatCurrency";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import LoadingPage from "@/components/loadingPage";
import useMyMemoryTranslation from "@/utils/getLocalizedField";
import { useTranslation } from "react-i18next";

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { i18n } = useTranslation();
  const targetLanguage = i18n.language; // Idioma actual de la página
  const sourceLanguage = "es";

  const {
    data: product,
    isLoading,
    error,
  } = useGetOne<IProduct>("products", id ?? "");
  const { translatedText: title } = useMyMemoryTranslation(
    product?.title ?? "",
    sourceLanguage,
    targetLanguage
  );
  const { translatedText: description } = useMyMemoryTranslation(
    product?.description ?? "",
    sourceLanguage,
    targetLanguage
  );
  // Loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            No pudimos cargar el producto
          </h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={() => navigate("/products")} variant="default">
            Volver a productos
          </Button>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Producto no encontrado
          </h2>
          <p className="text-muted-foreground mb-6">
            El producto que estás buscando no existe o ha sido eliminado.
          </p>
          <Button onClick={() => navigate("/products")} variant="default">
            Explorar productos
          </Button>
        </Card>
      </div>
    );
  }

  const productImageUrl =
    product.image && product.collectionId && product.id
      ? `https://nays-dream.pockethost.io/api/files/${product.collectionId}/${product.id}/${product.image}`
      : "/placeholder.svg?height=800&width=800";

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a productos
      </Button>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Imagen del producto */}
          <div className="bg-card/50 flex items-center justify-center p-6 md:p-10">
            <div className="relative w-full aspect-square">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={productImageUrl || "/placeholder.svg"}
                alt={product.title}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Detalles del producto */}
          <CardContent className="p-6 md:p-10 flex flex-col h-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {title}
              </h1>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-medium text-foreground">
                  Descripción
                </h3>
              </div>
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-foreground/90 break-words leading-relaxed">
                  {description || "Descripción no disponible."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-2xl font-bold text-primary">
                {typeof product.price === "number" ? (
                  <FormatCurrency value={product.price} />
                ) : (
                  "Precio no disponible"
                )}
              </div>

              <div className="flex items-center border border-border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-12 text-center font-medium text-foreground">
                  {quantity}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= 10}
                  className="h-10 w-10 rounded-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() =>
                  console.log(
                    `Añadiendo ${quantity} de ${product.title} al carrito`
                  )
                }
              >
                <ShoppingCart className="h-5 w-5" />
                Añadir al Carrito
              </Button>

              <div className="flex justify-between items-center text-sm text-muted-foreground mt-6 pt-4 border-t border-border">
                <div>
                  <span>Total: </span>
                  <span className="font-medium text-foreground">
                    {typeof product.price === "number" ? (
                      <FormatCurrency value={product.price * quantity} />
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default DetailProduct;
