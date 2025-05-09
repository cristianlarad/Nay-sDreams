// src/components/hero-01/hero-01.tsx
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { Title } from "../ui/Title"; // Asegúrate que la ruta sea correcta

interface Hero01Props {
  scrollY?: number; // Prop para recibir la posición del scroll
}

const Hero01: React.FC<Hero01Props> = ({ scrollY = 0 }) => {
  // Valor por defecto para scrollY
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl md:leading-[1.2] font-bold">
          {t("welcome")}
        </h1>
        {/* Pasa scrollY al componente Title */}
        <Title
          text="Nay's Dreams"
          className="text-center mb-8"
          scrollY={scrollY}
        />
        <p className="mt-6 text-[17px] md:text-lg">{t("description")}</p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            {t("getStarted")} <ArrowUpRight className="!h-5 !w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="!h-5 !w-5" /> {t("watchDemo")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero01;
