/**
 * LeftNav Component (Mobile Nav)
 * This component renders a left navigation menu containing a list of draggable elements.
 * Provides drag-and-drop functionality for its elements.
 */

import React from 'react';
import { useDrag } from 'react-dnd';

// List of elements available in the menu
const elementsList = [
	{ type: 'carousel', label: 'Carousel' }, // Carousel element
	{ type: 'text-editor', label: 'Text Editor' }, // Text Editor element
	{ type: 'call-to-action', label: 'Call to Action' }, // Call-to-Action element
];

// LeftNav Component
const LeftNav: React.FC<{ isMenuOpen: boolean; toggleMenu: () => void }> = ({
	isMenuOpen,
	toggleMenu,
}) => {
	return (
		// Main container for the left navigation menu
		<div
			className={`left-nav-menu fixed top-[72px] left-0 z-50 w-64 bg-gray-100 h-full shadow-lg transform ${
				isMenuOpen ? 'translate-x-0' : '-translate-x-full' // Slide-in/out transition based on menu state
			} transition-transform`}
			role='complementary'
			aria-label='Left Navigation'
		>
			{/* Menu content */}
			<div className='p-4'>
				{/* Menu heading */}
				<h2 className='text-xl font-bold mb-4'>Elements</h2>
				{/* Render a draggable element for each item in the list */}
				{elementsList.map((item) => (
					<DraggableElement key={item.type} item={item} />
				))}
			</div>
			{/* Close button for the menu */}
			<button
				onClick={toggleMenu}
				className='p-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded float-end mt-0 mr-4'
			>
				Close
			</button>
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
			{/* Label of the draggable item */}
			{item.label}
		</div>
	);
};

export default LeftNav;
