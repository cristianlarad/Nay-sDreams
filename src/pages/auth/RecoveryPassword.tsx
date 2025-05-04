import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import pb from "@/utils/instancePocketbase";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/Spinner";
import { SelectLenguaje } from "@/components/ui/selectLengaje";
import { useNavigate, useSearchParams } from "react-router-dom";

// Esquema de validación para solicitud de restablecimiento
const recoveryEmailSchema = Yup.object({
  email: Yup.string()
    .required("El correo es requerido")
    .email("Correo inválido"),
});

// Esquema de validación para nueva contraseña
const recoveryPasswordSchema = Yup.object({
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  passwordConfirm: Yup.string()
    .required("Confirmar contraseña es requerido")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
});

type RecoveryEmailFormData = Yup.InferType<typeof recoveryEmailSchema>;
type RecoveryPasswordFormData = Yup.InferType<typeof recoveryPasswordSchema>;

const RecoveryPassword: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Verificar si hay un token en la URL al cargar el componente
  React.useEffect(() => {
    const resetToken = searchParams.get("token");
    if (resetToken) {
      setToken(resetToken);
    }
  }, [searchParams]);

  // Formulario para solicitar restablecimiento
  const emailForm = useForm<RecoveryEmailFormData>({
    resolver: yupResolver(recoveryEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Formulario para nueva contraseña
  const passwordForm = useForm<RecoveryPasswordFormData>({
    resolver: yupResolver(recoveryPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  // Solicitar restablecimiento de contraseña
  const onEmailSubmit = async (data: RecoveryEmailFormData) => {
    try {
      setIsLoading(true);

      // Solicitar restablecimiento de contraseña
      await pb.collection("users").requestPasswordReset(data.email);

      toast.success(t("recovery.success"));
      setIsRequestSent(true);
    } catch (error) {
      console.error("Error en recuperación de contraseña:", error);
      toast.error(t("recovery.error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar nueva contraseña
  const onPasswordSubmit = async (data: RecoveryPasswordFormData) => {
    try {
      setIsLoading(true);

      if (!token) {
        toast.error(t("recovery.invalidToken"));
        return;
      }

      // Confirmar restablecimiento de contraseña
      await pb
        .collection("users")
        .confirmPasswordReset(token, data.password, data.password);

      toast.success(t("recovery.passwordChanged"));
      navigate("/login");
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      toast.error(t("recovery.passwordChangeError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado cuando se ha enviado solicitud de restablecimiento
  if (isRequestSent && !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex justify-between">
              {t("recovery.checkEmail")}
              <SelectLenguaje />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{t("recovery.checkEmailDescription")}</p>
            <Button
              variant="link"
              className="w-full mt-4"
              onClick={() => setIsRequestSent(false)}
            >
              {t("recovery.tryAgain")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderizado para cambiar contraseña
  if (token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner isLoading={isLoading} message={t("recovery.loading")} />

        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex justify-between">
                {t("recovery.newPassword")}
                <SelectLenguaje />
              </CardTitle>
              <CardDescription>
                {t("recovery.newPasswordDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>{t("password")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("password.placeholder")}
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>{t("passwordConfirm")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={t("passwordConfirm.placeholder")}
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {t("recovery.changePassword")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizado por defecto para solicitar email
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner isLoading={isLoading} message={t("recovery.loading")} />

      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex justify-between">
              {t("recovery.title")}
              <SelectLenguaje />
            </CardTitle>
            <CardDescription>{t("recovery.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="flex flex-col gap-6"
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("email.placeholder")}
                          type="email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {t("recovery.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecoveryPassword;
