/**
 * PreviewContainer Component
 * This component displays a preview of the specified element, such as a carousel (For elements that behave like Carousel).
 * It includes functionality to update the element's configuration and close the preview.
 */

import React from 'react';
import { useMobileEditor } from '../contexts/MobileEditorContext';
import Carousel from './Carousel';

// Props interface for the PreviewContainer component
interface PreviewContainerProps {
	element: any; // The element to preview
	onClose: () => void; // Callback to close the preview
}

const PreviewContainer: React.FC<PreviewContainerProps> = ({
	element,
	onClose,
}) => {
	const { setElements } = useMobileEditor(); // Access the MobileEditor context

	// If the element type is 'carousel', render the carousel preview
	if (element.type === 'carousel') {
		return (
			<div className='p-4 rounded'>
				{/* Carousel preview section */}
				<div className='mb-6'>
					<Carousel
						element={element}
						onUpdate={(updatedConfig) => {
							// Update the element's configuration in the context
							setElements((prev) =>
								prev.map((el) =>
									el.id === element.id
										? { ...el, config: { ...el.config, ...updatedConfig } }
										: el
								)
							);
						}}
						isPreview={true} // Enable preview mode for the carousel
					/>
				</div>

				{/* Close button for the preview */}
				<button
					onClick={onClose}
					className='bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 mt-[-12px] float-end'
				>
					Close Preview
				</button>
			</div>
		);
	}

	// Render a fallback message for unsupported element types
	return (
		<div>
			{/* Display the unsupported element type */}
			<p>Unknown element type: {element.type}</p>
			{/* Close button for the preview */}
			<button
				onClick={onClose}
				className='bg-gray-500 text-white px-3 py-1 rounded'
			>
				Close Preview
			</button>
		</div>
	);
};

export default PreviewContainer;
