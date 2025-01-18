import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// ------------------------------
// Type Definitions
// ------------------------------

/**
 * Represents the configuration of an individual element in the mobile editor.
 */
type ElementConfig = {
  id: string; // Unique identifier for the element
  type: "text-editor" | "call-to-action" | "carousel"; // The type of the element
  config: { [key: string]: any }; // Configuration data specific to the element type
};

/**
 * Represents the context type for the MobileEditor.
 */
type MobileEditorContextType = {
  elements: ElementConfig[]; // List of all elements in the editor
  setElements: React.Dispatch<React.SetStateAction<ElementConfig[]>>; // State updater for elements
  addElement: (type: "text-editor" | "call-to-action" | "carousel") => void; // Function to add a new element
};

// ------------------------------
// Context Creation
// ------------------------------

/**
 * Creates a React context for the mobile editor.
 * Default value is `undefined` to ensure it is used within a provider.
 */
const MobileEditorContext = createContext<MobileEditorContextType | undefined>(undefined);

// ------------------------------
// Provider Component
// ------------------------------

/**
 * MobileEditorProvider Component
 * Provides the `MobileEditorContext` to its children. Manages the state of elements
 * in the mobile editor, including adding new elements and updating their configurations.
 * @param children - The child components that require access to the mobile editor context.
 */

export const MobileEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1) Load from localStorage on initial mount
  const [elements, setElements] = useState<ElementConfig[]>(() => {
    try {
      const saved = localStorage.getItem("mobileEditorElements");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse localStorage:", err);
      return [];
    }
  });

  console.log("Initial elements:", elements);

  // 2) Whenever `elements` changes, save to localStorage
  useEffect(() => {
    localStorage.setItem("mobileEditorElements", JSON.stringify(elements));
  }, [elements]);

  /**
   * Adds a new element to the editor.
   * @param type - The type of the new element (e.g., "text-editor", "call-to-action", "carousel").
   */
  const addElement = (type: "text-editor" | "call-to-action" | "carousel") => {
    if (!type) {
      console.error("Type is undefined in addElement. Check the source of the call.");
      return;
    }

    // Create a new element based on its type with default configurations
    const newElement: ElementConfig = {
      id: Date.now().toString(), // Generate a unique ID based on the current timestamp
      type,
      config:
        type === "text-editor"
          ? {
              title: "Default Title",
              description: "Default Description",
              titleColour: "#000000", // Default colour for the title
              descriptionColour: "#555555", // Default colour for the description
            }
          : type === "call-to-action"
          ? {
              label: "Click Me",
              link: "https://example.com", // Default link
              buttonColour: "#3498db", // Default button colour
              textColour: "#ffffff", // Default text colour on the button
            }
          : {
              images: [
                {
                  url: "https://picsum.photos/800/1200?random=1", // Placeholder image
                  title: "Default Title",
                  description: "Default Description",
                },
                {
                  url: "https://picsum.photos/800/1200?random=2",
                  title: "Default Title",
                  description: "Default Description",
                },
                {
                  url: "https://picsum.photos/800/1200?random=3",
                  title: "Default Title",
                  description: "Default Description",
                },
              ],
              view: "landscape", // Default display mode
            },
    };

    console.log("New element created:", newElement);

    // Add the new element to the existing list of elements
    setElements((prev) => [...prev, newElement]);

    console.log("Elements updated:", elements);
  };

  return (
    <MobileEditorContext.Provider value={{ elements, setElements, addElement }}>
      {children}
    </MobileEditorContext.Provider>
  );
};

// ------------------------------
// Custom Hook
// ------------------------------

/**
 * Custom hook to access the `MobileEditorContext`.
 * Throws an error if used outside of a `MobileEditorProvider`.
 * @returns The context value containing elements, setElements, and addElement.
 */
export const useMobileEditor = () => {
  const context = useContext(MobileEditorContext);

  if (!context) {
    throw new Error("useMobileEditor must be used within a MobileEditorProvider");
  }

  return context;
};
