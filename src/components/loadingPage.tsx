import React from "react";
import { Progress } from "@/components/ui/progress";

const LoadingPage: React.FC = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 0 : prevProgress + 10
        );
      }, 500);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        <h1 className="text-4xl font-bold text-primary tracking-wider animate-pulse">
          Nay's Dreams
        </h1>

        <div className="relative">
          <Progress value={progress} className="w-64 h-2 bg-primary/20" />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translateX(${progress - 50}%)`,
              transition: "transform 0.5s ease-in-out",
            }}
          >
            <div className="w-4 h-4 bg-primary rounded-full shadow-lg"></div>
          </div>
        </div>

        <p className="text-muted-foreground animate-pulse">
          Loading magical experiences...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
