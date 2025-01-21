/**
 * LeftPanel Component
 * This component renders a left panel with a list of draggable elements.
 * Users can drag these elements and drop them onto a designated area on the screen.
 */

import React from 'react';
import { useDrag } from 'react-dnd';

// List of elements available for drag-and-drop
const elementsList = [
	{ type: 'carousel', label: 'Carousel' }, // Carousel element
	{ type: 'text-editor', label: 'Text Editor' }, // Text Editor element
	{ type: 'call-to-action', label: 'Call to Action' }, // Call-to-Action element
];

// LeftPanel Component
const LeftPanel: React.FC = () => {
	return (
		// Main container for the left panel
		<div id='left-panel' className='bg-zinc-50 p-4 h-full'>
			{/* Heading for the panel */}
			<h2 className='text-xl font-bold mb-4'>Elements</h2>
			{/* Instruction for users */}
			<p className='text-sm max-w-full font-light mb-4'>
				Drag and drop the element(s) you want onto the right side of the screen
			</p>
			{/* Render draggable elements from the list */}
			{elementsList.map((item) => (
				<DraggableElement key={item.type} item={item} />
			))}
		</div>
	);
};

// DraggableElement Component
const DraggableElement: React.FC<{ item: { type: string; label: string } }> = ({
	item,
}) => {
	// Hook to make the element draggable using react-dnd
	const [, drag] = useDrag(() => ({
		type: 'CONTENT_SECTION', // Drag type
		item: { id: item.type, type: item.type }, // Data associated with the dragged item
	}));

	return (
		// Draggable item container
		<div
			ref={drag} // Assign drag ref to make this element draggable
			className='draggable-item bg-white shadow rounded p-2 mb-2 cursor-pointer hover:bg-gray-200 transition'
		>
			{/* Label for the draggable item */}
			{item.label}
		</div>
	);
};

export default LeftPanel;
