import "./App.css";
import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd"; 
import { HTML5Backend } from "react-dnd-html5-backend"; 
import { MobileEditorProvider } from "./contexts/MobileEditorContext"; 
import LeftPanel from "./components/LeftPanel"; 
import RightPanel from "./components/RightPanel"; 
import Header from "./components/header";
import LeftNav from "./components/LeftNav";

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the visibility of the LeftNav
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.querySelector(".left-nav-menu");
      if (menu && !menu.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <DndProvider backend={HTML5Backend}>
      <MobileEditorProvider>
        <div className="w-screen fixed top-0 left-0 z-1000">
        <Header  />
        </div>
        <div className="app-container fixed top-0 flex min-h-screen w-screen ">
          <button
            className="left-nav-icon md:hidden sticky top-[72px] p-3 bg-gray-800 rounded-none text-white focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </div>
          </button>
          <div className="hidden md:block w-1/4 max-w-[300px] bg-zinc-50 p-4 border-r mt-[72px] min-h-screen">
            <LeftPanel />
          </div>
          <LeftNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
          <div className="right-panel flex-1 bg-zinc-200 top-0 mt-[72px] h-dvh overflow-y-auto">
            <RightPanel />
          </div>
        </div>
      </MobileEditorProvider>
    </DndProvider>
  );
};

export default App;
