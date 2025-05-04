import React from "react";

interface SpinnerProps {
  isLoading?: boolean;
  size?: "small" | "medium" | "large";
  message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  isLoading = false,
  size = "large",
  message = "Cargando...",
}) => {
  if (!isLoading) return null;

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center 
        bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`
            ${sizeClasses[size]} 
            border-[6px] border-white/30 
            border-t-white 
            rounded-full 
            animate-spin
          `}
        />
        <p className="text-white text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};
