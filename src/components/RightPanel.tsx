
import React from "react";
import { useDrop } from "react-dnd";
import { useMobileEditor } from "../contexts/MobileEditorContext";
import ItemContainer from "./ItemContainer";

const RightPanel: React.FC = () => {
  const { elements, addElement } = useMobileEditor();

  const [, drop] = useDrop(() => ({
    accept: "CONTENT_SECTION",
    drop: (item: { id?: string; type?: string; index?: number }) => {
      if (item.index === undefined && item.type) {
        addElement(item.type as "text-editor" | "call-to-action" | "carousel");
      }
    },
  }));

  return (
    <div ref={drop} className="bg-transparent p-4 pb-16 h-full overflow-y-auto">
      {elements.map((element, index) => (
        <ItemContainer key={element.id} element={element} index={index} />
      ))}
    </div>
  );
};

export default RightPanel;