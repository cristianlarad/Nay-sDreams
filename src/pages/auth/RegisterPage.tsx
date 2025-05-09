import React from "react";
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
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner"; // Asegúrate de tener instalado sonner
import { useTranslation } from "react-i18next";
import { SelectLenguaje } from "@/components/ui/selectLengaje";
import usePost from "@/hooks/usePost";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const form = useForm<IRegister>({
    resolver: yupResolver(registerShema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      username: "",
    },
  });
  const { mutate, isPending } = usePost({
    url: "sign-up",
    onSuccess() {
      toast.success("Usuario registrado exitosamente");
      navigate("/");
    },
    onError() {
      toast.error("Error al registrar usuario");
    },
  });
  const onSubmit = async (data: IRegister) => {
    mutate({
      data,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner isLoading={isPending} message="Registrando usuario..." />

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
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("name.placeholder")}
                          {...field}
                          disabled={isPending}
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
                          disabled={isPending}
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
                          disabled={isPending}
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
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
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
