import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerShema } from "@/types/login";
import { IRegister } from "@/types/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import pb from "@/utils/instancePocketbase";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner"; // Asegúrate de tener instalado sonner
import { useTranslation } from "react-i18next";
import { SelectLenguaje } from "@/components/ui/selectLengaje";
interface PocketBaseError {
  data?: {
    data?: {
      email?: {
        code: string;
        message: string;
      };
    };
  };
  message?: string;
}
const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const form = useForm<IRegister>({
    resolver: yupResolver(registerShema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      name: "",
    },
  });

  const onSubmit = async (data: IRegister) => {
    try {
      setIsLoading(true);

      // Preparar datos para PocketBase
      const { ...userData } = data;

      // Crear usuario en PocketBase
      await pb.collection("users").create({
        ...userData,
        passwordConfirm: data.password, // PocketBase requiere este campo
      });

      // Iniciar sesión automáticamente después del registro
      await pb.collection("users").authWithPassword(data.email, data.password);

      toast.success(t("register.success"));
      navigate("/");
    } catch (error: PocketBaseError | unknown) {
      console.error("Error durante el registro:", error);

      // Manejo de errores específicos
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        (error as PocketBaseError).data?.data?.email
      ) {
        toast.error(t("register.error"));
        form.setError("email", {
          type: "manual",
          message: "Este correo ya está en uso",
        });
      } else {
        toast.error(t("register.error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner isLoading={isLoading} message="Registrando usuario..." />

      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex justify-between">
              {t("register.title")}
              <SelectLenguaje />
            </CardTitle>
            <CardDescription>{t("register.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("name.placeholder")}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("email.placeholder")}
                          {...field}
                          type="email"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("password.placeholder")}
                          type="password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirma tu contraseña"
                          type="password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {t("register")}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              {t("register.Account")}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("login.title")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
