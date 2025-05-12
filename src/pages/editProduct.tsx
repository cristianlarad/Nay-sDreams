"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeft, Pencil, Save } from "lucide-react";

import { useGetOne } from "@/hooks/useGetOne";
import {
  editProductSchema,
  IEditPRoduct,
  type IProductOne,
} from "@/types/products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FormText from "@/components/ui/FormText";
import FormAmount from "@/components/ui/FormAmount";
import ErrorPage from "./ErrorsPage";
import LoadingPage from "@/components/loadingPage";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, error, isPending } = useGetOne<IProductOne>(
    `product/${id}`
  );

  const product = data?.product;
  const form = useForm<IEditPRoduct>({
    resolver: yupResolver(editProductSchema),
    defaultValues: product,
  });

  const onSubmit = (data: IEditPRoduct) => {
    console.log(data);
  };

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        description: product.description,
        price: product.price,
        // Asegúrate de mapear todos los campos necesarios desde `product`
      });
    }
  }, [product, form]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("Volver a productos")}
      </Button>
      {isLoading && isPending && !data ? (
        <LoadingPage />
      ) : (
        <Card className="overflow-hidden border  shadow-md">
          <CardHeader className="">
            <div className="flex items-center justify-center space-x-2">
              <Pencil className="h-5 w-5 text-pink-500" />
              <CardTitle className="text-center text-xl font-serif text-pink-800">
                {t("edit.product")}
              </CardTitle>
            </div>
            <CardDescription className="text-center text-pink-600">
              {t("update.product.details")}
            </CardDescription>
          </CardHeader>

          <div className="relative">
            {product?.image_url && (
              <div className="relative h-96 sm:h-96 overflow-hidden border-b ">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full  "
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-medium text-lg drop-shadow-md truncate">
                    {product.title}
                  </h3>
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6">
                  <FormText
                    control={form.control}
                    name="title"
                    label={t("product.title")}
                    placeholder={t("enter.product.title")}
                    className="border-pink-200 focus:border-pink-400"
                  />

                  <FormText
                    control={form.control}
                    name="description"
                    label={t("product.description")}
                    type="textArea"
                    placeholder={t("enter.product.description")}
                    className="min-h-[120px] border-pink-200 focus:border-pink-400"
                  />

                  <FormAmount
                    control={form.control}
                    name="price"
                    label={t("price")}
                    className="border-pink-200 focus:border-pink-400"
                  />
                </div>

                <div className="pt-2">
                  <Separator className="my-6 bg-pink-100" />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 px-6"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {t("save.changes")}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditProductPage;
