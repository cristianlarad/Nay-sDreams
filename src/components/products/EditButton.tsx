import useAuth from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface IProductsPRops {
  id: string;
}

const EditButton = ({ id }: IProductsPRops) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      {user?.roles === "ADMIN" && (
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
