import React from "react";
import { useState, useEffect } from "react";
import { IoMoonOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoIosDesktop } from "react-icons/io";
const DarkModeButton = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'system'
  );
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const options = [
    {
      icon: <IoMoonOutline />,
      text: "light",
    },
    {
      icon: <IoSunnyOutline />,
      text: "dark",
    },
    {
      icon: <IoIosDesktop />,
      text: "system",
    },
  ];
  function onWindowMatch(){
    if(localStorage.theme === 'dark' || (!('theme' in localStorage)) && darkQuery.matches){
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  useEffect(() => {
    switch (theme) {
      case "dark":
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
        break;
      case "light":
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        break;
      default:
        localStorage.removeItem("theme");
        onWindowMatch();
        break;
    }
  }, [theme]);

  return (
    <div className=" duration-100 flex items-center justify-center dark:text-gray-100 dark:bg-slate-600 bg-gray-100 rounded">
      {options?.map((opt) => (
        <button
          key={opt.text}
          className={`w-8 h-8 flex items-center justify-center leading-9 text-xl rounded-full m-1 ${
            theme === opt.text && "text-sky-600"
          }`}
          onClick={() => setTheme(opt.text)}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};

export default DarkModeButton;