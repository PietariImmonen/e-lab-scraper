import { Loader2 } from "lucide-react";
import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default LoadingScreen;
