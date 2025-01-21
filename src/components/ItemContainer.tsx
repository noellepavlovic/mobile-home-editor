/**
 * ItemContainer Component
 * This component serves as a container for rendering different types of elements dynamically.
 * It uses the `MobileEditorContext` to manage and update the state of elements.
 */

import React from 'react';
import { useMobileEditor } from '../contexts/MobileEditorContext';
import TextEditor from './TextEditor';
import Carousel from './Carousel';
import CallToAction from './CallToAction';

const ItemContainer: React.FC<{ element: any; index: number }> = ({
	element,
	index,
}) => {
	// Access `MobileEditorContext` for elements and their state management
	const { elements, setElements } = useMobileEditor();

	/**
	 * Dynamically render the appropriate component based on the element type.
	 * This ensures flexibility in supporting various element types.
	 */
	const renderElement = () => {
		switch (element.type) {
			// Render the TextEditor component for 'text-editor' elements
			case 'text-editor':
				return <TextEditor element={element} index={index} />;

			// Render the Carousel component for 'carousel' elements
			case 'carousel':
				return (
					<Carousel
						element={element}
						onUpdate={(updatedConfig) => {
							// Update the configuration of the carousel element
							const updatedElements = [...elements];
							updatedElements[index] = { ...element, config: updatedConfig };
							setElements(updatedElements); // Update context state
						}}
					/>
				);

			// Render the CallToAction component for 'call-to-action' elements
			case 'call-to-action':
				return <CallToAction element={element} index={index} />;

			// Handle unknown element types gracefully
			default:
				return <div className='text-red-500'>Unknown element type</div>;
		}
	};

	return (
		// Container for the rendered element, with styles for layout and appearance
		<div
			className={`content-section bg-white p-4 mb-6 rounded-lg shadow max-w-[1000px] mx-auto 'opacity-100'`}
		>
			{/* Call the renderElement function to display the appropriate component */}
			{renderElement()}
		</div>
	);
};

export default ItemContainer;
