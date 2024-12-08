import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { SidebarMenuButton } from "./ui/sidebar";
import { SunMoon } from "lucide-react";
function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on page load
  useEffect(() => {
    // Check if a theme is saved in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  // Toggle dark mode on button click
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      // Save the new theme to localStorage
      if (newMode) {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  return (
    <SidebarMenuButton asChild onClick={toggleDarkMode}>
      <a href="#">
        <SunMoon />
        {darkMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </a>
    </SidebarMenuButton>
  );
}

export default ThemeToggle;
