import React from "react";
import Carousel from "./Carousel";
import { useMobileEditor } from "../contexts/MobileEditorContext";

interface PreviewContainerProps {
  element: any;         
  onClose: () => void; 
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({ element, onClose }) => {
  const { setElements } = useMobileEditor();

  if (element.type === "carousel") {
    return (
      <div className="p-4 rounded">
        {/* Preview Section */}
        <div className="mb-6">
          <Carousel
            element={element}
            onUpdate={(updatedConfig) => {
              setElements((prev) =>
                prev.map((el) =>
                  el.id === element.id
                    ? { ...el, config: { ...el.config, ...updatedConfig } }
                    : el
                )
              );
            }}
            isPreview={true}
          />
        </div>

       
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 mt-[-12px] float-end"
        >
          Close Preview
        </button>
      </div>
    );
  }

  
  return (
    <div>
      <p>Unknown element type: {element.type}</p>
      <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">
        Close Preview
      </button>
    </div>
  );
};

export default PreviewContainer;
