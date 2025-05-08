"use client";

import { useState } from "react";
import { useGetOne } from "@/hooks/useGetOne";
import type { IProduct } from "@/types/products";
import { FormatCurrency } from "@/utils/FormatCurrency";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
  Package,
  Plus,
  Minus,
  Heart,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import LoadingPage from "@/components/loadingPage";
import useMyMemoryTranslation from "@/utils/getLocalizedField";
import { useTranslation } from "react-i18next";

const DetailProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { i18n, t } = useTranslation();
  const targetLanguage = i18n.language;
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
        <Card className="max-w-md mx-auto text-center p-6 bg-white dark:bg-slate-800 border-none shadow-xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            {t("No pudimos cargar el producto")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {error.message}
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            {t("Volver a productos")}
          </Button>
        </Card>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-6 bg-white dark:bg-slate-800 border-none shadow-xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 mb-6">
            <Package className="h-10 w-10 text-slate-500 dark:text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            {t("Producto no encontrado")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t("El producto que estás buscando no existe o ha sido eliminado.")}
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            {t("Explorar productos")}
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("Volver a productos")}
      </Button>

      <div className="relative">
        {/* Elementos decorativos de fondo */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl -z-10"></div>

        {/* Tarjeta principal con forma no convencional */}
        <div className="bg-white dark:bg-popover rounded-2xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Columna de imagen con forma no rectangular */}
            <div className="lg:col-span-2 relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-popover dark:to-popover p-6 lg:p-0 flex items-center justify-center">
              {/* En móviles usamos un contenedor normal, en desktop usamos clip-path */}
              <div className="relative w-full h-full min-h-[300px] lg:min-h-0 lg:absolute lg:inset-0 overflow-hidden lg:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-popover dark:to-popover"></div>
                <div className="h-full w-full flex items-center justify-center p-4 lg:p-10">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={productImageUrl || "/placeholder.svg"}
                    alt={product.title}
                    className={`w-full h-full max-h-[300px] lg:max-h-none object-contain transition-all duration-500 ${
                      imageLoaded
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
              </div>

              {/* Badge de precio flotante */}
              <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
                <Badge className="bg-primary text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                  <FormatCurrency value={product.price} />
                </Badge>
              </div>

              {/* Botón de favorito */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md transition-transform hover:scale-110"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* Columna de detalles */}
            <div className="lg:col-span-3 p-6 md:p-10 flex flex-col h-full relative">
              {/* Elemento decorativo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent dark:from-primary/5 -z-10"></div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  {title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="text-xs font-normal text-slate-500 dark:text-slate-400 px-2"
                  >
                    ID: {product.id?.substring(0, 8)}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6 bg-slate-200 dark:bg-slate-700" />

              {/* Descripción con estilo mejorado */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-3">
                  {t("Descripción")}
                </h3>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 break-words leading-relaxed">
                    {description || t("Descripción no disponible.")}
                  </p>
                </div>
              </div>

              {/* Características del producto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t("Envío gratis")}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t("Garantía")}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {t("Entrega rápida")}
                  </span>
                </div>
              </div>

              {/* Selector de cantidad con estilo mejorado */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div className="text-xl font-bold text-slate-800 dark:text-white">
                  {t("Cantidad")}
                </div>

                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden bg-white dark:bg-slate-700 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-none text-slate-600 dark:text-slate-300"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-12 text-center font-medium text-slate-800 dark:text-white">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
                    className="h-10 w-10 rounded-none text-slate-600 dark:text-slate-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Botón de añadir al carrito y total */}
              <div className="mt-auto space-y-4">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-white rounded-full py-6 shadow-lg shadow-primary/20 dark:shadow-primary/10 transition-transform hover:scale-[1.02]"
                  onClick={() =>
                    console.log(
                      `Añadiendo ${quantity} de ${product.title} al carrito`
                    )
                  }
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t("Añadir al Carrito")}
                </Button>

                <div className="flex justify-between items-center text-sm mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-slate-600 dark:text-slate-400">
                    {t("Total")}:
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {typeof product.price === "number" ? (
                      <FormatCurrency value={product.price * quantity} />
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
