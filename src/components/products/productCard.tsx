import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { IProduct } from "@/types/products";
import { FormatCurrency } from "@/utils/FormatCurrency";

import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EditButton from "./EditButton";

interface IProductsPRops {
  product: IProduct;
}

const ProductCard = ({ product }: IProductsPRops) => {
  const { t } = useTranslation();
  return (
    <Card className="shadow-none overflow-hidden mb-4 rounded-md">
      <CardHeader className="p-0">
        <div className="overflow-hidden h-64 w-full">
          <img
            src={`https://nays-dream.pockethost.io/api/files/${product.collectionId}/${product.id}/${product.image}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/5 text-primary hover:bg-primary/5 shadow-none">
            <FormatCurrency value={product.price} />
          </Badge>
        </div>
        <h3 className="mt-4 text-[1.35rem] font-semibold tracking-tight">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-3">{product.description}</p>
      </CardContent>
      <CardFooter className="flex item-center justify-between">
        <Link to={`/products/${product.id}/detail`}>
          <Button className="shadow-none cursor-pointer hover:bg-primary/50">
            {t("read.more")} <ChevronRight />
          </Button>
        </Link>
        <EditButton id={product.id} />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
