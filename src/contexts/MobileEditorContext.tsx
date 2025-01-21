import React, {
	createContext, // Creates a context for managing and sharing state.
	useContext, // Allows access to the context from child components.
	useState, // Manages local state within the component.
	ReactNode, // Type for React child components.
	useEffect, // Runs side effects such as persisting state to localStorage.
} from 'react';

// The `ElementConfig` type and context setup will use these utilities.

// Type definition for the configuration of an individual element
type ElementConfig = {
	id: string; // Unique identifier for the element
	type: 'text-editor' | 'call-to-action' | 'carousel'; // Specifies the type of element
	config: { [key: string]: any }; // Configuration details specific to the element type
};

// Type definition for the context, including state and functions
type MobileEditorContextType = {
	elements: ElementConfig[]; // List of all elements in the editor
	setElements: React.Dispatch<React.SetStateAction<ElementConfig[]>>; // Function to update the state of elements
	addElement: (type: 'text-editor' | 'call-to-action' | 'carousel') => void; // Function to add a new element
};

// Create a context with an initial value of `undefined`
const MobileEditorContext = createContext<MobileEditorContextType | undefined>(
	undefined
);

// Provider component to manage and expose the context state
export const MobileEditorProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	// State for storing editor elements, initialized from `localStorage`
	const [elements, setElements] = useState<ElementConfig[]>(() => {
		try {
			// Attempt to load saved elements from localStorage
			const saved = localStorage.getItem('mobileEditorElements');
			return saved ? JSON.parse(saved) : [];
		} catch (err) {
			// Handle errors in parsing localStorage data
			console.error('Failed to parse localStorage:', err);
			return [];
		}
	});

	// Persist the `elements` state to `localStorage` whenever it changes
	useEffect(() => {
		localStorage.setItem('mobileEditorElements', JSON.stringify(elements));
	}, [elements]);

	// Function to add a new element to the editor
	const addElement = (type: 'text-editor' | 'call-to-action' | 'carousel') => {
		// Ensure a valid type is provided
		if (!type) {
			console.error(
				'Type is undefined in addElement. Check the source of the call.'
			);
			return;
		}

		// Create a new element with default configuration
		const newElement: ElementConfig = {
			id: Date.now().toString(), // Use current timestamp as a unique ID
			type,
			config: {
				images: [
					{
						url: 'https://picsum.photos/800/1200?random=1',
						title: 'Default Title',
						description: 'Default Description',
					},
					{
						url: 'https://picsum.photos/800/1200?random=2',
						title: 'Default Title',
						description: 'Default Description',
					},
					{
						url: 'https://picsum.photos/800/1200?random=3',
						title: 'Default Title',
						description: 'Default Description',
					},
				],
				view: 'landscape', // Default display mode for the element
			},
		};

		// Add the new element to the state
		setElements((prev) => [...prev, newElement]);
	};

	return (
		// Provide the `elements` state and helper functions to child components
		<MobileEditorContext.Provider value={{ elements, setElements, addElement }}>
			{children}
		</MobileEditorContext.Provider>
	);
};

// Hook to access the MobileEditor context
export const useMobileEditor = () => {
	// Retrieve the context
	const context = useContext(MobileEditorContext);

	// Throw an error if the hook is used outside of the provider
	if (!context) {
		throw new Error(
			'useMobileEditor must be used within a MobileEditorProvider'
		);
	}

	return context;
};
