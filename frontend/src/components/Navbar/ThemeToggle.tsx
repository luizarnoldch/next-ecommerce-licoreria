"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative"
    >
      <Moon
        className={
          "h-5 w-5 transition-all text-primary " +
          (isDark ? "block opacity-100" : "hidden opacity-0 scale-90 absolute")
        }
      />
      <Sun
        className={
          "h-5 w-5 transition-all text-primary " +
          (isDark ? "hidden opacity-0 scale-90 absolute" : "block opacity-100")
        }
      />

    </Button>
  );
}

export default ThemeToggle;