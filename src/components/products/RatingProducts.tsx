"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarProps {
  fillPercentage: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  animated?: boolean;
}

const Star = ({
  fillPercentage,
  size = 24,
  activeColor = "#EC4899", // Pink-500
  inactiveColor = "#E5E7EB", // Gray-200
  className = "",
  animated = true,
}: StarProps) => {
  const widthPercent = Math.max(0, Math.min(100, fillPercentage * 100));
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={cn("inline-block relative", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: isHovered && animated ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background star (empty) */}
      <StarIcon
        size={size}
        fill={inactiveColor}
        stroke={inactiveColor}
        className="absolute left-0 top-0"
      />

      {/* Foreground star (filled) - with gradient and clip path */}
      <span
        className="absolute left-0 top-0 overflow-hidden"
        style={{ width: `${widthPercent}%` }}
      >
        <StarIcon
          size={size}
          className="text-transparent"
          style={{
            fill: activeColor,
            stroke: activeColor,
          }}
        />
      </span>
    </span>
  );
};

interface RatingProductsProps {
  rating: number;
  size?: number;
  showText?: boolean;
  textClassName?: string;
  starClassName?: string;
  animated?: boolean;
}

const RatingProducts = ({
  rating,
  size = 24,
  showText = false,
  textClassName = "ml-2 text-sm font-medium text-pink-600",
  starClassName = "mr-0.5",
  animated = true,
}: RatingProductsProps) => {
  const totalStars = 5;
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center">
      <div className="flex">
        {Array.from({ length: totalStars }, (_, index) => {
          const starRatingValue = rating - index;
          let fillPercentage = 0;

          if (starRatingValue >= 1) {
            fillPercentage = 1; // Full star
          } else if (starRatingValue > 0) {
            fillPercentage = starRatingValue; // Partial star
          }

          return (
            <Star
              key={index}
              fillPercentage={fillPercentage}
              size={size}
              activeColor="var(--star-fill-color, #EC4899)"
              className={cn(starClassName, "star-rating")}
              animated={animated}
            />
          );
        })}
      </div>

      {showText && (
        <span className={textClassName}>{roundedRating.toFixed(1)}</span>
      )}

      {/* CSS for gradient stars */}
      <style>{`
        .star-rating {
          --star-fill-color: #ec4899;
        }

        @media (prefers-reduced-motion: no-preference) {
          .star-rating:nth-child(1) {
            --star-fill-color: #ec4899;
          }
          .star-rating:nth-child(2) {
            --star-fill-color: #db2777;
          }
          .star-rating:nth-child(3) {
            --star-fill-color: #c026d3;
          }
          .star-rating:nth-child(4) {
            --star-fill-color: #a855f7;
          }
          .star-rating:nth-child(5) {
            --star-fill-color: #8b5cf6;
          }
        }
      `}</style>
    </div>
  );
};

export default RatingProducts;
