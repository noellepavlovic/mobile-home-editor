import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useMobileEditor } from '../contexts/MobileEditorContext';
import TextEditor from './TextEditor';
import Carousel from './Carousel';
import CallToAction from './CallToAction';

const ItemContainer: React.FC<{ element: any; index: number }> = ({
	element,
	index,
}) => {
	const { elements, setElements } = useMobileEditor();

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'CONTENT_SECTION',
		item: { id: element.id, type: element.type, index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));

	const [, drop] = useDrop(() => ({
		accept: 'CONTENT_SECTION',
		hover: (draggedItem: { id: string; type: string; index?: number }) => {
			if (draggedItem.index === undefined || draggedItem.index === index)
				return;

			const updatedElements = [...elements];
			const [movedElement] = updatedElements.splice(draggedItem.index, 1);
			updatedElements.splice(index, 0, movedElement);

			setElements(updatedElements);
			draggedItem.index = index;
		},
	}));

	const renderElement = () => {
		switch (element.type) {
			case 'text-editor':
				return <TextEditor element={element} index={index} />;
			case 'carousel':
				return (
					<Carousel
						element={element}
						onUpdate={(updatedConfig) => {
							const updatedElements = [...elements];
							updatedElements[index] = { ...element, config: updatedConfig };
							setElements(updatedElements);
						}}
					/>
				);
			case 'call-to-action':
				return <CallToAction element={element} index={index} />;
			default:
				return <div className='text-red-500'>Unknown element type</div>;
		}
	};

	return (
		<div
			ref={(node) => drag(drop(node))}
			className={`content-section bg-white p-4 mb-6 rounded-lg shadow max-w-[1000px] mx-auto ${
				isDragging ? 'opacity-50' : 'opacity-100'
			}`}
		>
			{renderElement()}
		</div>
	);
};

export default ItemContainer;
