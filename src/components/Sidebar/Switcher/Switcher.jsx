import { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useDarkSlice from "../../../hooks/useDarkSlice";

export default function Switcher() {
  const [colorTheme, setTheme] = useDarkSlice();
  const [darkSlice, setDarkSlice] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSlice(checked);
  };

  return (
    <>
      <DarkModeSwitch
        className=""
        checked={darkSlice}
        onChange={toggleDarkMode}
        size={30}
      />
    </>
  );
}
