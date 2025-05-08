import pb from "@/utils/instancePocketbase";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface IProductsPRops {
  id: string;
}

const EditButton = ({ id }: IProductsPRops) => {
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

  return (
    <div>
      {userInfo.email === "die.hts1@gmail.com" && (
        <Link to={`/products/${id}/edit`}>
          <Button className="shadow-none cursor-pointer hover:bg-primary/50">
            {t("edit")}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EditButton;
