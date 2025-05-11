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
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { SelectLenguaje } from "@/components/ui/selectLengaje";
import usePost from "@/hooks/usePost";
import useAuth from "@/hooks/useAuth";

interface IResponseLogin {
  token: string;
  user: {
    id: string;
    username: string;
    roles: string;
  };
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate, isPending } = usePost({
    url: "login",
    onSuccess(response: IResponseLogin) {
      toast.success(t("login.success"));
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      login({
        id: response.user.id,
        username: response.user.username,
        roles: response.user.roles as "ADMIN" | "USER",
      });
      navigate("/");
      console.log(response);
    },
    onError() {
      toast.error(t("login.error"));
    },
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      data: {
        username: email,
        password,
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* Spinner de pantalla completa */}
      <Spinner isLoading={isPending} message="Iniciando sesión..." />

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
                <Label htmlFor="username">Nombre</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="nombre"
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

              <Button type="submit" className="w-full" disabled={isPending}>
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
