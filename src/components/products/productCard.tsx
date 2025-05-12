"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IProduct } from "@/types/products";
import { FormatCurrency } from "@/utils/FormatCurrency";
import { ChevronRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EditButton from "./EditButton";
import useMyMemoryTranslation from "@/utils/getLocalizedField";
import React from "react";
import RatingProducts from "./RatingProducts";

interface IProductsPRops {
  product: IProduct;
}

const ProductCard = React.memo(({ product }: IProductsPRops) => {
  const { i18n } = useTranslation();
  const targetLanguage = i18n.language;
  const sourceLanguage = "es";
  const { translatedText: title } = useMyMemoryTranslation(
    product.title,
    sourceLanguage,
    targetLanguage
  );

  const { t } = useTranslation();

  return (
    <div className="group relative mb-8 mx-auto w-full ">
      <div className="relative overflow-visible bg-white dark:bg-popover rounded-lg shadow-lg transition-all duration-500 group-hover:shadow-xl">
        <div
          className="relative h-64 w-full "
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)",
          }}
        >
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>

          {/* Elemento decorativo */}
          <div className="absolute top-4 left-4 bg-white dark:bg-popover rounded-full p-1 shadow-md transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
          </div>
        </div>

        {/* Círculo decorativo que sobresale */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-primary/90 dark:bg-primary/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Badge className="bg-transparent border-0 text-white font-bold p-0">
            <FormatCurrency value={product.price} />
          </Badge>
        </div>

        {/* Contenido con forma asimétrica */}
        <div className="relative p-6 pt-4 pb-5">
          {/* Línea decorativa */}
          <div className="flex items-center justify-between">
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-purple-500 dark:from-primary dark:to-purple-400 rounded-full mb-4"></div>
            <RatingProducts rating={product.rating} size={20} showText />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-[1.35rem]  font-bold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-primary/90 transition-colors line-clamp-2">
              {title}
            </h3>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <Link to={`/products/${product.id}/detail`}>
              <Button className=" hover:bg-primary text-white  dark:hover:bg-primary dark:text-white shadow-md transition-all duration-300">
                {t("read.more")}
                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <EditButton id={product.id} />
          </div>
        </div>
      </div>

      {/* Sombra decorativa que cambia con el tema */}
      <div className="absolute -bottom-3 -right-3 w-full h-full bg-gradient-to-br from-primary/30 to-purple-500/30 dark:from-primary/20 dark:to-purple-600/20 rounded-lg -z-10 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
});

export default ProductCard;
