import { SunIcon, MoonIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className: string }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (
      localStorage.getItem("darkMode") === "true" ||
      document.documentElement.classList.contains("dark")
    ) {
      return true;
    } else {
      return document.documentElement.classList.contains("dark");
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);
  return (
    <Button
      variant="outline"
      size="icon-xs"
      onClick={() => setDarkMode((d: boolean) => !d)}
      aria-label={darkMode ? "Use light theme" : "Use dark theme"}
      className={className}
    >
      {darkMode ? (
        <SunIcon className="size-4 p-0" />
      ) : (
        <MoonIcon className="size-4 p-0" />
      )}
    </Button>
  );
}
