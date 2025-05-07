import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProduct, productShema } from "@/types/products";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import pb from "@/utils/instancePocketbase";
import { Spinner } from "@/components/ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import FormText from "@/components/ui/FormText";
import FormAmount from "@/components/ui/FormAmount";
import { useGetOne } from "@/hooks/useGetOne";
import { InferType } from "yup";
import { ArrowLeft } from "lucide-react";

const EditProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: productData,
    isLoading: isLoadingProduct,
    error: productError,
  } = useGetOne<IProduct>("products", id!);

  const [isUploading, setIsUploading] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  type ProductFormData = InferType<typeof productShema>;
  const form = useForm<ProductFormData>({
    resolver: yupResolver(productShema),
  });

  useEffect(() => {
    if (productData) {
      form.reset({
        id: productData.id,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        image: productData.image, // Existing image filename
        collectionId: productData.collectionId,
        collectionName: productData.collectionName,
        created: productData.created,
        updated: productData.updated,
      });
      if (productData.image && productData.collectionId && productData.id) {
        setImagePreviewUrl(
          `https://nays-dream.pockethost.io/api/files/${productData.collectionId}/${productData.id}/${productData.image}`
        );
      } else {
        setImagePreviewUrl(null); // Or a placeholder like "/placeholder.svg"
      }
    }
  }, [productData, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setNewImageFile(null);
      if (productData?.image && productData.collectionId && productData.id) {
        setImagePreviewUrl(
          `https://nays-dream.pockethost.io/api/files/${productData.collectionId}/${productData.id}/${productData.image}`
        );
      } else {
        setImagePreviewUrl(null);
      }
    }
  };

  const onSubmit = async (values: IProduct) => {
    if (!id) return;

    try {
      setIsUploading(true);
      const dataForUpdate: Partial<IProduct> = {
        title: values.title,
        description: values.description,
        price: values.price,
      };

      if (newImageFile) {
        const formData = new FormData();
        if (dataForUpdate.title) formData.append("title", dataForUpdate.title);
        if (dataForUpdate.description)
          formData.append("description", dataForUpdate.description);
        if (dataForUpdate.price !== undefined)
          formData.append("price", dataForUpdate.price.toString());

        formData.append("image", newImageFile);
        await pb.collection("products").update(id, formData);
      } else {
        await pb.collection("products").update(id, dataForUpdate);
      }

      setNewImageFile(null);
      navigate("/products");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-screen">
        <Spinner
          isLoading={true}
          message={t(
            "loading.product.details",
            "Cargando detalles del producto..."
          )}
        />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="container mx-auto text-center py-8 text-red-600">
        {t("error.loading.product", "Error al cargar el producto:")}{" "}
        {productError.message}
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="container mx-auto text-center py-8">
        {t("product.not.found", "Producto no encontrado.")}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl pb-4">
      <Button
        variant="ghost"
        className="mb-6 flex items-center text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a productos
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">
            {t("edit.product", "Editar Producto")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="product-image-display"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("product.image.label", "Imagen del Producto")}
                </label>
                <div className="mt-1 flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                    {imagePreviewUrl ? (
                      <img
                        src={imagePreviewUrl}
                        alt={t("image.preview.alt", "Vista previa")}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">
                        {t("no.image.available", "Sin imagen")}
                      </span>
                    )}
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    {t("change.image.button", "Cambiar Imagen")}
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  {newImageFile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setNewImageFile(null);
                        const fileInput = document.getElementById(
                          "file-upload"
                        ) as HTMLInputElement;
                        if (fileInput) fileInput.value = "";
                        if (
                          productData?.image &&
                          productData.collectionId &&
                          productData.id
                        ) {
                          setImagePreviewUrl(
                            `https://nays-dream.pockethost.io/api/files/${productData.collectionId}/${productData.id}/${productData.image}`
                          );
                        } else {
                          setImagePreviewUrl(null);
                        }
                      }}
                    >
                      {t("cancel.image.change.button", "Cancelar cambio")}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormText
                  control={form.control}
                  name="title"
                  label={t("title.create.product", "Título")}
                  placeholder={t(
                    "title.placeholder",
                    "Ej: Camiseta de algodón"
                  )}
                />
                <FormAmount
                  control={form.control}
                  name="price"
                  label={t("price", "Precio")}
                  placeholder={t("price.placeholder", "Ej: 29.99")}
                />
              </div>

              <FormText
                control={form.control}
                name="description"
                label={t("description.create.product", "Descripción")}
                placeholder={t(
                  "description.placeholder",
                  "Detalles del producto..."
                )}
                type="textArea"
                className="min-h-[100px]"
              />
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isUploading || isLoadingProduct}
              >
                {isUploading
                  ? t("uploading", "Guardando...")
                  : t("save", "Guardar Cambios")}
              </Button>
              {isUploading && (
                <div className="flex justify-center pt-2">
                  <Spinner
                    isLoading={isUploading}
                    size="small"
                    message={t("uploading.message", "Procesando...")}
                  />
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductPage;
