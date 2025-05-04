import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const NavMenu = (props: NavigationMenuProps) => {
  const { t } = useTranslation();
  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-4 data-[orientation=vertical]:ml-5">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/"
              className="hover:text-primary transition-colors duration-200"
            >
              {t("home")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/products"
              className="hover:text-primary transition-colors duration-200"
            >
              {t("products")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="#"
              className="hover:text-primary transition-colors duration-200"
            >
              {t("about")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="#"
              className="hover:text-primary transition-colors duration-200"
            >
              {t("contact")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
