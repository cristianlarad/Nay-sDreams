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
import UserAvatar from "../ui/userAvatar";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<{
    username?: string;
    email?: string;
    roles?: string;
  }>({});

  useEffect(() => {
    const userString = localStorage.getItem("user");
    console.log(`hola${userString}`);

    try {
      const userData = JSON.parse(userString ?? "");
      console.log(userData);
      setUserInfo(userData); // Assuming userData is { name?: string }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUserInfo({}); // Set to empty object or default if parsing fails
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Obtener iniciales o primera letra

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full p-1 h-10 w-10 flex items-center justify-center"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src="https://img.icons8.com/?size=100&id=43985&format=png&color=000000"
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center space-x-3 py-3">
          <UserAvatar
            name={userInfo.username}
            fallbackStyle="initials"
            imageUrl="https://img.icons8.com/?size=100&id=44007&format=png&color=000000"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{userInfo.email}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
              {userInfo.username}
            </span>
          </div>
        </DropdownMenuLabel>

        {userInfo.roles === "ADMIN" && (
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
