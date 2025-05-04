import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProductShema, ICreateProducts } from "@/types/products";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ImageIcon, PlusCircleIcon, XIcon } from "lucide-react";
import pb from "@/utils/instancePocketbase";
import { Spinner } from "@/components/ui/Spinner";
import { useNavigate } from "react-router-dom";

const CreatePRoductsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<ICreateProducts>({
    resolver: yupResolver(createProductShema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      image: undefined,
    },
  });

  const onSubmit = async (data: ICreateProducts) => {
    try {
      setIsUploading(true);
      const record = await pb.collection("products").create(data);
      console.log(record);
      form.reset();
      setImagePreview(null);
      navigate("/products");
    } catch (error) {
      console.error("Error al crear producto:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">{t("create.product")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      {t("image")}
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer 
                          bg-gray-50 dark:bg-gray-800 
                          hover:bg-gray-100 dark:hover:bg-gray-700 
                          transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <PlusCircleIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              {t("add.image")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("image.formats.allowed")}
                            </p>
                          </div>
                          <Input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                form.setValue("image", file, {
                                  shouldValidate: true,
                                });

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImagePreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {imagePreview && (
                          <div className="mt-4 w-full relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full h-64 object-cover rounded-lg shadow-md"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 rounded-full"
                              onClick={() => setImagePreview(null)}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("title")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("product.title.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("price")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("product.price.placeholder")}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("descrip")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("product.description.placeholder")}
                        {...field}
                        className="min-h-[120px] resize-y"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-4 flex items-center justify-center"
                disabled={isUploading}
              >
                {isUploading ? "Subiendo..." : t("create.product")}
              </Button>
              <Spinner
                isLoading={isUploading}
                size="small"
                message="Subiendo..."
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePRoductsPage;
