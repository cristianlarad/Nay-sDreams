import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCircle2, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslation } from "react-i18next";
import pb from "@/utils/instancePocketbase";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<{
    email?: string;
    name?: string;
    avatar?: string;
  }>({});

  useEffect(() => {
    // Obtener información del usuario autenticado
    if (pb.authStore.isValid) {
      const user = pb.authStore.model;
      setUserInfo({
        email: user?.email,
        name: user?.name || user?.username,
        avatar: user?.avatar ? pb.files.getUrl(user, user.avatar) : undefined,
      });
    }

    const unsubscribe = pb.authStore.onChange((_, model) => {
      if (model) {
        setUserInfo({
          email: model.email,
          name: model.name || model.username,
          avatar: model.avatar
            ? pb.files.getUrl(model, model.avatar)
            : undefined,
        });
      } else {
        setUserInfo({});
      }
    });

    // Limpiar suscripción
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      pb.authStore.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error durante el logout:", error);
    }
  };

  // Obtener iniciales o primera letra
  const getInitials = () => {
    if (userInfo.name) {
      return userInfo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    return userInfo.email ? userInfo.email[0].toUpperCase() : "U";
  };

  // No mostrar nada si no hay usuario autenticado
  if (!pb.authStore.isValid) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full p-1 h-10 w-10 flex items-center justify-center"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={userInfo.avatar || undefined}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center space-x-3 py-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={userInfo.avatar || undefined}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {userInfo.name || userInfo.email?.split("@")[0] || "User"}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {userInfo.email}
            </span>
          </div>
        </DropdownMenuLabel>

        {userInfo.email === "die.hts1@gmail.com" && (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              navigate("/products/create");
            }}
            className="cursor-pointer focus:bg-accent"
          >
            <UserCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{t("create.product")}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
          className="cursor-pointer text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="text-sm">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
