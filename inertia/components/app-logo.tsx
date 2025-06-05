import { useEffect, useState } from "react";
import AppLogoIcon from "./app-logo-icon"; // Light mode logo
import AppLogoIconDark from "./app-logo-icon-dark"; // Dark mode logo

export default function AppLogo() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  return (
    <>
      <div className="bg-sidebar-secondary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
        {isDarkMode ? (
          <AppLogoIconDark className="size-5 fill-current text-white" />
        ) : (
          <AppLogoIcon className="size-6 fill-current text-white" />
        )}
      </div>
      <div className="-ml-6 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-none font-semibold">
          {isDarkMode ? (
            <img src="/tsdlogo-label-white.png" className="p-4 mb-12" />
          ) : (
            <img src="/tsdlogo-label.png" className="p-4" />
          )}
        </span>
      </div>
    </>
  );
}
