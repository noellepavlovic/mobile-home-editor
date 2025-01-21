/**
 * RightPanel Component
 * This component serves as the drop zone for drag-and-drop elements.
 * It integrates with the `MobileEditorContext` to manage the dropped elements and renders each element inside an `ItemContainer`.
 */

import React from 'react';
import { useDrop } from 'react-dnd';
import { useMobileEditor } from '../contexts/MobileEditorContext';
import ItemContainer from './ItemContainer';

// Interface for the RightPanel props
interface RightPanelProps {
	elements: any[]; // Array of elements to display in the panel
	onDrop?: (item: { id: string; type: string; index?: number }) => void; // Optional callback for drop events
}

// RightPanel Component
const RightPanel: React.FC<RightPanelProps> = ({ elements, onDrop }) => {
	const { addElement } = useMobileEditor(); // Access the MobileEditor context

	// Initialize the drop zone using react-dnd's useDrop hook
	const [, drop] = useDrop(() => ({
		accept: 'CONTENT_SECTION', // Accepts items of type 'CONTENT_SECTION'
		drop: (item: { id?: string; type?: string; index?: number }) => {
			console.log('Drop handler called with item:', item); // Log dropped item for debugging
			if (item.id && item.type) {
				// Add the dropped element to the editor
				addElement(item.type as 'text-editor' | 'call-to-action' | 'carousel');
				// Call the optional onDrop callback if provided
				if (onDrop) {
					onDrop({ id: item.id, type: item.type });
				}
			}
		},
	}));

	console.log('useDrop initialized'); // Log the initialization of the drop zone

	return (
		// Drop zone container
		<div
			ref={drop} // Attach the drop zone reference
			data-testid='dropzone' // Test ID for testing purposes
			id='dropzone' // Element ID
			className='bg-transparent p-4 pb-16 h-full overflow-y-auto' // Styling for layout and scrolling
		>
			{/* Render each element in an ItemContainer */}
			{elements.map((element, index) => (
				<ItemContainer key={element.id} element={element} index={index} />
			))}
		</div>
	);
};

export default RightPanel;
