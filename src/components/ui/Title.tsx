import React from "react";
import "@/styles/global.css"; // Importar el CSS global

interface TitleProps {
  text?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export const Title: React.FC<TitleProps> = ({
  text = "Nay's Dreams",
  className = "",
  size = "medium",
}) => {
  // Colores vibrantes para cada letra
  const colors = [
    "text-pink-500",
    "text-purple-500",
    "text-indigo-500",
    "text-blue-500",
    "text-orange-500",
    "text-red-500",
  ];

  // Definir tamaños
  const sizeClasses = {
    small: "text-lg sm:text-xl",
    medium: "text-4xl sm:text-5xl md:text-6xl",
    large: "text-5xl sm:text-6xl md:text-7xl",
  };

  return (
    <h1
      className={`
        ${sizeClasses[size]}
        md:leading-[1.2] 
        font-bold 
        flex 
        justify-center 
        items-center 
        ${className}
      `}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={`
            animate-wiggle 
            inline-block 
            transition-all 
            duration-300 
            ${char === " " ? "mx-1" : colors[index % colors.length]}
            ${size === "small" ? "text-base" : ""}
          `}
          style={{
            animationDelay: `${index * 0.1}s`, // Desfase para efecto de onda
          }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
};
