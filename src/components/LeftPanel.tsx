
import React from "react";
import { useDrag } from "react-dnd";

const elementsList = [
  { type: "carousel", label: "Carousel" },
  { type: "text-editor", label: "Text Editor" },
  { type: "call-to-action", label: "Call to Action" },
];

const LeftPanel: React.FC = () => {
  return (
    <div className="left-panel bg-zinc-50 p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Elements</h2>
      {elementsList.map((item) => (
        <DraggableElement key={item.type} item={item} />
      ))}
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

export default LeftPanel;