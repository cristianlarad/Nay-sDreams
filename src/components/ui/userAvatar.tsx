"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type AvatarStyle = "initials" | "icon" | "abstract" | "gradient";

export interface UserAvatarProps {
  /**
   * User's name for initials or alt text
   */
  name?: string;

  /**
   * URL to the user's profile image
   */
  imageUrl?: string;

  /**
   * Size of the avatar in pixels
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Style to use when no image is available
   */
  fallbackStyle?: AvatarStyle;

  /**
   * Custom CSS class names
   */
  className?: string;

  /**
   * Status indicator (online, offline, away, etc.)
   */
  status?: "online" | "offline" | "away" | "busy" | "none";
}

/**
 * Get initials from a name (up to 2 characters)
 */
const getInitials = (name: string): string => {
  if (!name) return "";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Get a deterministic color based on a string
 */
const getColorFromString = (str: string): string => {
  if (!str) return "var(--avatar-color, #EC4899)"; // Default pink

  const colors = [
    "#EC4899", // Pink-500
    "#DB2777", // Pink-600
    "#BE185D", // Pink-700
    "#C026D3", // Fuchsia-600
    "#A855F7", // Purple-500
    "#8B5CF6", // Violet-500
    "#F472B6", // Pink-400
    "#E879F9", // Fuchsia-400
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Get a positive index
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

/**
 * Generate an abstract pattern SVG for the avatar
 */
const AbstractPattern = ({ seed, color }: { seed: string; color: string }) => {
  // Use the seed to generate a deterministic pattern
  const hash = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Generate some shapes based on the hash
  const shapes = [];
  const baseColor = color;

  // Create 3-5 shapes
  const numShapes = (hash % 3) + 3;

  for (let i = 0; i < numShapes; i++) {
    const shapeType = (hash + i) % 3; // 0: circle, 1: rectangle, 2: triangle
    const x = (hash + i * 5) % 100;
    const y = (hash + i * 7) % 100;
    const size = ((hash + i * 11) % 40) + 10;
    const opacity = (((hash + i * 13) % 60) + 40) / 100;

    if (shapeType === 0) {
      // Circle
      shapes.push(
        <circle
          key={i}
          cx={`${x}%`}
          cy={`${y}%`}
          r={`${size / 2}%`}
          fill={baseColor}
          opacity={opacity}
        />
      );
    } else if (shapeType === 1) {
      // Rectangle
      shapes.push(
        <rect
          key={i}
          x={`${x - size / 2}%`}
          y={`${y - size / 2}%`}
          width={`${size}%`}
          height={`${size}%`}
          fill={baseColor}
          opacity={opacity}
          rx="20%"
        />
      );
    } else {
      // Triangle
      const points = `${x},${y - size / 2} ${x - size / 2},${y + size / 2} ${
        x + size / 2
      },${y + size / 2}`;
      shapes.push(
        <polygon key={i} points={points} fill={baseColor} opacity={opacity} />
      );
    }
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100%" height="100%" fill="#FDF2F8" />{" "}
      {/* Light pink background */}
      {shapes}
    </svg>
  );
};

const UserAvatar = ({
  name = "",
  imageUrl,
  size = "md",
  fallbackStyle = "abstract",
  className,
  status = "none",
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-base",
    xl: "h-24 w-24 text-lg",
  };

  // Status indicator styles
  const statusStyles = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    none: "hidden",
  };

  // Get color based on name
  const color = getColorFromString(name);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if we should show the image
  const showImage = imageUrl && !imageError;

  // Generate fallback content based on style
  const getFallbackContent = () => {
    switch (fallbackStyle) {
      case "initials":
        return getInitials(name);
      case "icon":
        return <User className="h-1/2 w-1/2" />;
      case "abstract":
        return <AbstractPattern seed={name || "user"} color={color} />;
      case "gradient":
        return null; // The gradient is applied via CSS
      default:
        return <User className="h-1/2 w-1/2" />;
    }
  };

  // Get background style for gradient
  const getBackgroundStyle = () => {
    if (fallbackStyle === "gradient") {
      const secondColor = getColorFromString(name + "salt");
      return {
        background: `linear-gradient(135deg, ${color} 0%, ${secondColor} 100%)`,
      };
    }

    if (fallbackStyle === "initials") {
      return {
        backgroundColor: color,
      };
    }

    return {};
  };

  return (
    <div className="relative inline-block">
      <Avatar
        className={cn(
          sizeMap[size],
          "border-2 border-pink-100",
          fallbackStyle === "initials" && "text-white font-medium",
          className
        )}
      >
        {showImage && (
          <AvatarImage
            src={imageUrl || "/placeholder.svg"}
            alt={`${name}'s profile`}
            onError={handleImageError}
          />
        )}

        <AvatarFallback
          delayMs={600}
          style={getBackgroundStyle()}
          className={cn(
            "flex items-center justify-center",
            fallbackStyle === "abstract" && "p-0 overflow-hidden"
          )}
        >
          {getFallbackContent()}
        </AvatarFallback>
      </Avatar>

      {/* Status indicator */}
      {status !== "none" && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-white",
            statusStyles[status],
            size === "sm" ? "h-2 w-2" : "h-3 w-3",
            size === "lg" && "h-4 w-4",
            size === "xl" && "h-5 w-5"
          )}
        />
      )}
    </div>
  );
};

export default UserAvatar;
