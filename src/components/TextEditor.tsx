/**
 * TextEditor Component
 * This component provides an editor for a text widget, allowing users to modify title, description, font sizes, and colors.
 * It integrates with the MobileEditor context to manage and persist element configurations.
 */

import React, { useState } from 'react';
import { useMobileEditor } from '../contexts/MobileEditorContext';
import { preventDrag } from '../helpers/preventDrag';

interface TextEditorProps {
	element: any; // The element being edited
	index: number; // The index of the element in the editor
}

// Available font sizes for the dropdown
const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32];

const TextEditor: React.FC<TextEditorProps> = ({ element, index }) => {
	const { elements, setElements } = useMobileEditor();
	console.log('TextEditor mounted. Element:', elements);

	// State for managing editing mode, delete modal visibility, and hex input errors
	const [editingField, setEditingField] = useState<
		'title' | 'description' | null
	>(null);
	const [showDeleteElementModal, setShowDeleteElementModal] = useState(false);
	const [hexInputError, setHexInputError] = useState<string | null>(null);

	/**
	 * Updates the configuration of the element in the context.
	 * @param key - The key to update in the element's configuration.
	 * @param value - The new value to set.
	 */
	const handleConfigChange = (key: string, value: string | number) => {
		setElements((prev) => {
			const cloned = [...prev];
			cloned[index].config[key] = value;
			if (!cloned[index].config.isEdited) {
				cloned[index].config.isEdited = true;
			}
			return cloned;
		});
	};

	/**
	 * Opens the modal for editing the title or description.
	 * @param field - The field to edit ('title' or 'description').
	 */
	const openEditModal = (field: 'title' | 'description') => {
		setEditingField(field);
	};

	/**
	 * Closes the edit modal and resets the hex input error state.
	 */
	const closeEditModal = () => {
		setEditingField(null);
		setHexInputError(null);
	};

	/**
	 * Handles changes to the hex color input and validates the input format.
	 * @param value - The new value of the hex input.
	 * @param key - The key to update in the element's configuration.
	 */
	const handleHexInputChange = (value: string, key: string) => {
		handleConfigChange(key, value);

		if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
			setHexInputError(null);
			handleConfigChange(key, value);
		} else {
			setHexInputError('Invalid hex code. Use format #RRGGBB or #RGB.');
		}
	};

	/**
	 * Deletes the element from the context.
	 */
	const handleDeleteElement = () => {
		setElements((prev) => prev.filter((_, i) => i !== index));
		setShowDeleteElementModal(false);
	};

	// Destructure the element configuration for easier access
	const {
		title = '',
		description = '',
		titleColour = '#000000',
		titleFontSize = 16,
		descriptionColour = '#000000',
		descriptionFontSize = 14,
		isEdited = false,
	} = element.config;

	return (
		<div className='p-2 mb-4'>
			<h3 className='font-bold text-2xl mb-4'>Text Widget Editor</h3>

			{/* Live Preview */}
			{isEdited && (
				<>
					<p className='font-bold text-xl text-cyan-600 ml-1 mb-1'>
						Live Preview
					</p>
					<div className='p-4 mb-4 rounded shadow bg-white'>
						<h2
							className='mb-4 px-2'
							style={{ color: titleColour, fontSize: titleFontSize }}
						>
							{title}
						</h2>
						<p
							className='mb-4 px-2'
							style={{
								color: descriptionColour,
								fontSize: descriptionFontSize,
							}}
						>
							{description}
						</p>
					</div>
				</>
			)}

			{/* Editor Fields */}
			<div className='flex flex-col flex-wrap p-5 pb-10 shadow rounded bg-zinc-50'>
				{/* Title Field */}
				<div className='flex flex-col flex-wrap mb-4'>
					<label className='font-medium text-xl mb-2'>Title:</label>
					<div className='flex flex-row flex-wrap gap-2 items-center'>
						<input
							aria-label='Title'
							type='text'
							value={title}
							onChange={(e) => handleConfigChange('title', e.target.value)}
							onDragStart={preventDrag}
							draggable
							placeholder='Enter title here'
							className='w-[75%] border border-gray-300 rounded px-2 py-1 h-[30px] text-sm'
						/>
						<button
							aria-label='Edit Title'
							onClick={() => openEditModal('title')}
							className='inline-flex items-center p-2 h-[30px] rounded text-white bg-cyan-500 hover:bg-cyan-600'
						>
							Edit
						</button>
					</div>
				</div>

				{/* Description Field */}
				<div className='flex flex-col flex-wrap mb-4'>
					<label className='mb-2 text-xl font-medium'>Description:</label>
					<textarea
						aria-label='Description'
						value={description}
						onChange={(e) => handleConfigChange('description', e.target.value)}
						onDragStart={preventDrag}
						draggable
						placeholder='Enter description here'
						className='block w-full mb-2 border border-gray-300 rounded px-2 py-1 h-24 text-sm'
					/>
					<div className='flex flex-col self-end gap-2'>
						<button
							aria-label='Edit Description'
							onClick={() => openEditModal('description')}
							className='inline-flex items-center p-2 h-[30px] min-w-fit self-end rounded text-white bg-cyan-500 hover:bg-cyan-600'
						>
							Edit
						</button>
					</div>
				</div>

				{/* Delete Element Button */}
				<div className='flex flex-row self-end mb-[-20px] gap-2'>
					<button
						aria-label='Delete Element 1'
						onClick={() => setShowDeleteElementModal(true)}
						className='h-[30px] inline-flex items-center p-2 bg-rose-500 text-white rounded hover:bg-rose-600'
					>
						Delete Element
					</button>
				</div>
			</div>

			{/* Modals */}
			{/* Edit Modal */}
			{editingField && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-4 rounded-lg shadow-lg w-[300px]'>
						<h3 className='mb-2 text-lg font-semibold'>
							{editingField === 'title'
								? 'Edit Title Font'
								: 'Edit Description Font'}
						</h3>

						{/* Hex Color Input */}
						<label className='block mb-1'>Colour (Hex):</label>
						<div className='flex gap-1 justify-between items-center mb-1'>
							<input
								aria-label='Colour (Hex)'
								type='text'
								value={
									editingField === 'title' ? titleColour : descriptionColour
								}
								onChange={(e) =>
									handleHexInputChange(
										e.target.value,
										editingField === 'title'
											? 'titleColour'
											: 'descriptionColour'
									)
								}
								onDragStart={preventDrag}
								draggable
								onBlur={(e) =>
									handleHexInputChange(
										e.target.value,
										editingField === 'title'
											? 'titleColour'
											: 'descriptionColour'
									)
								}
								className='w-full mb-4 border border-gray-300 rounded px-2 py-1'
							/>
							<input
								aria-label='Colour Picker'
								type='color'
								value={
									editingField === 'title' ? titleColour : descriptionColour
								}
								onChange={(e) =>
									handleConfigChange(
										editingField === 'title'
											? 'titleColour'
											: 'descriptionColour',
										e.target.value
									)
								}
								onDragStart={preventDrag}
								draggable
								className='w-[33px] h-[32px] px-0.5 mb-4 border border-gray-300 rounded'
							/>
						</div>
						{hexInputError && (
							<p className='text-red-500 text-sm mb-4'>{hexInputError}</p>
						)}

						{/* Font Size Selector */}
						<label htmlFor='font-size' className='block mb-1'>
							Font Size:
						</label>
						<select
							id='font-size'
							aria-label='Font Size'
							value={
								editingField === 'title' ? titleFontSize : descriptionFontSize
							}
							onChange={(e) => {
								const newSize = parseInt(e.target.value, 10);
								handleConfigChange(
									editingField === 'title'
										? 'titleFontSize'
										: 'descriptionFontSize',
									newSize
								);
							}}
							className='block w-full mb-4 border border-gray-300 rounded px-2 py-1'
						>
							{FONT_SIZES.map((size) => (
								<option key={size} value={size}>
									{size}px
								</option>
							))}
						</select>

						{/* Modal Actions */}
						<div className='flex justify-end space-x-2'>
							<button
								aria-label='Cancel'
								onClick={closeEditModal}
								className='bg-gray-300 px-3 py-1 rounded hover:bg-gray-400'
							>
								Cancel
							</button>
							<button
								aria-label='OK'
								onClick={closeEditModal}
								disabled={
									(editingField === 'title' ||
										editingField === 'description') &&
									!!hexInputError
								}
								className='bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								OK
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteElementModal && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-4 rounded shadow-lg max-w-[300px] min-w-[250px]'>
						<p className='mb-4'>
							Are you sure you want to delete this element?
						</p>
						<div className='flex flex-wrap justify-end gap-2'>
							<button
								aria-label='Cancel'
								onClick={() => setShowDeleteElementModal(false)}
								className='bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600'
							>
								Cancel
							</button>
							<button
								aria-label='Delete Element 2'
								onClick={handleDeleteElement}
								className='bg-rose-500 text-white px-2 py-2 rounded hover:bg-rose-600'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TextEditor;
