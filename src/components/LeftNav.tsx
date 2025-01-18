
import React from "react";
import { useDrag } from "react-dnd";

const elementsList = [
  { type: "carousel", label: "Carousel" },
  { type: "text-editor", label: "Text Editor" },
  { type: "call-to-action", label: "Call to Action" },
];

const LeftNav: React.FC<{ isMenuOpen: boolean; toggleMenu: () => void }> = ({
  isMenuOpen,
  toggleMenu,
}) => {
  return (
    <div
      className={`left-nav-menu fixed top-[72px] left-0 z-50 w-64 bg-gray-100 h-full shadow-lg transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform`}
    >
     
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Elements</h2>
        {elementsList.map((item) => (
          <DraggableElement key={item.type} item={item} />
        ))}
      </div>
      <button
        onClick={toggleMenu}
        className="p-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded float-end mt-0 mr-4"
      >
        Close
      </button>
    </div>
  );
};

const DraggableElement: React.FC<{ item: { type: string; label: string } }> = ({ item }) => {
  const [, drag] = useDrag(() => ({
    type: "CONTENT_SECTION",
    item: { id: item.type, type: item.type },
  }));

  return (
    <div
      ref={drag}
      className="draggable-item bg-white shadow rounded p-2 mb-2 cursor-pointer hover:bg-gray-200 transition"
    >
      {item.label}
    </div>
  );
};

export default LeftNav;