import React, { useState } from "react";
import { useMobileEditor } from "../contexts/MobileEditorContext";
import { preventDrag } from "../helpers/preventDrag";

interface TextEditorProps {
  element: any;
  index: number;
}

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32];

const TextEditor: React.FC<TextEditorProps> = ({ element, index }) => {
  const { elements, setElements } = useMobileEditor();
  console.log("TextEditor mounted. Element:", elements);

  const [editingField, setEditingField] = useState<"title" | "description" | null>(null);
  const [showDeleteElementModal, setShowDeleteElementModal] = useState(false);
  const [hexInputError, setHexInputError] = useState<string | null>(null);

  const handleConfigChange = (key: string, value: string | number) => {
    setElements((prev) => {
      const updated = [...prev];
      updated[index].config[key] = value;
      return updated;
    });
  };

  const openEditModal = (field: "title" | "description") => {
    setEditingField(field);
  };

  const closeEditModal = () => {
    setEditingField(null);
    setHexInputError(null);
  };

  const handleHexInputChange = (value: string, key: string) => {
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
      setHexInputError(null);
      handleConfigChange(key, value);
    } else {
      setHexInputError("Invalid hex code. Use format #RRGGBB or #RGB.");
    }
  };

  const handleDeleteElement = () => {
    setElements((prev) => prev.filter((_, i) => i !== index));
    setShowDeleteElementModal(false);
  };

  const {
    title = "",
    description = "",
    titleColour = "#000000",
    titleFontSize = 16,
    descriptionColour = "#000000",
    descriptionFontSize = 14,
  } = element.config;

  return (
    <div className="p-2 mb-4">
      <h3 className="font-bold text-2xl mb-4">"Text" Element Editor</h3>

      <div className="p-4 mb-4 rounded shadow bg-white">
        <h2 className={`mb-4 px-2`} style={{ color: titleColour, fontSize: titleFontSize }}>{title}</h2>
        <p className={`mb-4 px-2`} style={{ color: descriptionColour, fontSize: descriptionFontSize }}>{description}</p>
      </div>

      
      <div className="flex flex-col flex-wrap  p-5 pb-10 shadow rounded bg-zinc-50">

        <div className="flex flex-col flex-wrap mb-4">
          <label className="font-medium text-xl mb-2">Title:</label>
          <div className="flex flex-row flex-wrap gap-2 items-center">
            <input
              type="text"
              value={title}
              onChange={(e) => handleConfigChange("title", e.target.value)}
              onDragStart={preventDrag}
              draggable
              className="w-[75%] border border-gray-300 rounded px-2 py-1 h-[30px] text-sm"
            />
            <button
              onClick={() => openEditModal("title")}
              className="inline-flex items-center p-2 h-[30px] rounded text-white bg-cyan-500 hover:bg-cyan-600"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-wrap mb-4">
          <label className="mb-2 text-xl font-medium">Description:</label>
          <textarea
            value={description}
            onChange={(e) => handleConfigChange("description", e.target.value)}
            onDragStart={preventDrag}
            draggable
            className="block w-full mb-2 border border-gray-300 rounded px-2 py-1 h-24 text-sm"
          />
          <div className="flex flex-col self-end gap-2">
            <button
              onClick={() => openEditModal("description")}
              className="inline-flex items-center p-2 h-[30px] min-w-fit self-end rounded text-white bg-cyan-500 hover:bg-cyan-600"
            >
             Edit 
            </button>
          </div>
        </div>
        <div className="flex flex-row self-end mb-[-20px] gap-2">
          <button
            onClick={() => setShowDeleteElementModal(true)}
            className="h-[30px] inline-flex items-center p-2 bg-rose-500 text-white rounded hover:bg-rose-600"
          >
            Delete Element
          </button>
        </div>
      </div>
      {editingField && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[300px]">
            <h3 className="mb-2 text-lg font-semibold">
              {editingField === "title" ? "Edit Title Font" : "Edit Description Font"}
            </h3>

            <label className="block mb-1">Colour (Hex):</label>
            <div className="flex gap-1 justify-between items-center mb-1">
              <input
                type="text"
                value={editingField === "title" ? titleColour : descriptionColour}
                onChange={(e) =>
                  handleHexInputChange(
                    e.target.value,
                    editingField === "title" ? "titleColour" : "descriptionColour"
                  )
                }
                onDragStart={preventDrag}
                draggable
                onBlur={(e) =>
                  handleHexInputChange(
                    e.target.value,
                    editingField === "title" ? "titleColour" : "descriptionColour"
                  )
                }
                className="w-full mb-4 border border-gray-300 rounded px-2 py-1"
              />
              <input
                type="color"
                value={editingField === "title" ? titleColour : descriptionColour}
                onChange={(e) =>
                  handleConfigChange(
                    editingField === "title" ? "titleColour" : "descriptionColour",
                    e.target.value
                  )
                }
                onDragStart={preventDrag}
                draggable
                className="w-[33px] h-[32px] px-0.5 mb-4 border border-gray-300 rounded"
              />
            </div>
            {hexInputError && <p className="text-red-500 text-sm">{hexInputError}</p>}

            <label className="block mb-1">Font Size:</label>
            <select
              value={editingField === "title" ? titleFontSize : descriptionFontSize}
              onChange={(e) => {
                const newSize = parseInt(e.target.value, 10);
                handleConfigChange(
                  editingField === "title" ? "titleFontSize" : "descriptionFontSize",
                  newSize
                );
              }}
              className="block w-full mb-4 border border-gray-300 rounded px-2 py-1"
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={closeEditModal}
                className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteElementModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <p className="mb-4">Are you sure you want to delete this text element?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteElementModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteElement}
                className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
