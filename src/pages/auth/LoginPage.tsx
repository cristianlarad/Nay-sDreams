import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pb from "@/utils/instancePocketbase";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { SelectLenguaje } from "@/components/ui/selectLengaje";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      // Iniciar autenticación con Google
      await pb.collection("users").authWithOAuth2({
        provider: "google",
        redirectUrl: "http://localhost:3000/auth/callback",
      });

      navigate("/");
    } catch (error) {
      console.error("Error de autenticación:", error);
      // Manejar error (mostrar mensaje al usuario)
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await pb.collection("users").authWithPassword(email, password);
      toast.success(t("login.success"));
      navigate("/");
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.error(t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Spinner de pantalla completa */}
      <Spinner isLoading={isLoading} message="Iniciando sesión..." />

      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex justify-between">
              {t("login.title")}
              <SelectLenguaje />
            </CardTitle>
            <CardDescription>{t("methods.login")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailLogin} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {t("login.button")}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2">{t("login.or")}</span>
                </div>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full"
                onClick={loginWithGoogle}
                disabled={isLoading}
              >
                {t("login.button.google")}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <Button variant="link"></Button>
              {t("login.noAccount")}
              <Link
                to="/register"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t("login.register")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
