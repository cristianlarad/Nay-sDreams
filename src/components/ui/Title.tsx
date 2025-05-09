// src/components/ui/Title.tsx
import React from "react";
import "@/styles/global.css"; // Importar el CSS global

interface TitleProps {
  text?: string;
  className?: string;
  size?: "small" | "medium" | "large";
  scrollY?: number; // Prop para recibir la posición del scroll
}

export const Title: React.FC<TitleProps> = ({
  text = "Nay's Dreams",
  className = "",
  size = "medium",
  scrollY = 0, // Valor por defecto
}) => {
  const colors = [
    "text-pink-500",
    "text-purple-500",
    "text-indigo-500",
    "text-blue-500",
    "text-orange-500",
    "text-red-500",
  ];

  const sizeClasses = {
    small: "text-lg sm:text-xl",
    medium: "text-4xl sm:text-5xl md:text-6xl", // Este es el que se usa por defecto
    large: "text-5xl sm:text-6xl md:text-7xl",
  };

  // --- Lógica de Escala ---
  const scrollStartEffect = 0; // Pixel de scroll donde empieza el efecto
  const scrollEndEffect = 400; // Pixel de scroll donde el efecto llega a su máximo (ajústalo a tu gusto)
  const minScale = 1; // Escala inicial
  const maxScale = 80.8; // Escala máxima (ajústalo a tu gusto)

  let currentScale = minScale;
  if (scrollY > scrollStartEffect) {
    // Calcula el progreso del scroll dentro del rango del efecto (0 a 1)
    const progress = Math.min(
      1,
      (scrollY - scrollStartEffect) / (scrollEndEffect - scrollStartEffect)
    );
    // Interpola la escala basado en el progreso
    currentScale = minScale + progress * (maxScale - minScale);
  }
  // Asegurarse que la escala no exceda el máximo ni sea menor al mínimo
  currentScale = Math.max(minScale, Math.min(maxScale, currentScale));
  // --- Fin Lógica de Escala ---

  return (
    <h1
      className={`
        ${sizeClasses[size]}
        md:leading-[1.2] 
        font-bold 
        flex 
        justify-center 
        items-center 
        z-0
        ${className}
      `}
      style={{
        transform: `scale(${currentScale})`,
        transformOrigin: "center", // Importante para que escale desde el centro
        transition: "transform 0.05s linear", // Transición suave para la escala
        // Si Lenis ya provee un scrollY muy suave, esta transición puede ser muy corta o incluso innecesaria.
      }}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`
            inline-block 
            ${char === " " ? "mx-1" : colors[index % colors.length]}
            ${size === "small" ? "text-base" : ""}
          `}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};
