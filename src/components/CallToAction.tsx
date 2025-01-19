import React, { useState } from 'react';
import { useMobileEditor } from '../contexts/MobileEditorContext';
import { validateURL } from '../helpers/validateURL';
import { preventDrag } from '../helpers/preventDrag';

interface CallToActionProps {
	element: any;
	index: number;
}

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36];

const CallToAction: React.FC<CallToActionProps> = ({ element, index }) => {
	const { elements, setElements } = useMobileEditor();
	console.log('CallToAction mounted. Elements:', elements);
	const [editingField, setEditingField] = useState<
		'title' | 'description' | 'button' | 'background' | null
	>(null);

	const [showDeleteElementModal, setShowDeleteElementModal] = useState(false);

	const [linkError, setLinkError] = useState<string | null>(null);

	const [hexInputError, setHexInputError] = useState<string | null>(null);

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

	const handleHexInputChange = (value: string, key: string) => {
		handleConfigChange(key, value);

		if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)) {
			setHexInputError(null);
			handleConfigChange(key, value);
		} else {
			setHexInputError('Invalid hex code. Use format #RRGGBB or #RGB.');
		}
	};

	const closeEditModal = () => {
		setEditingField(null);
		setHexInputError(null);
		setLinkError(null);
	};

	const handleDeleteElement = () => {
		setElements((prev) => prev.filter((_, i) => i !== index));
		setShowDeleteElementModal(false);
	};

	const handleLinkChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		handleConfigChange('link', value);

		try {
			const validUrl = await validateURL({
				args: {
					value,
					siblingData: { type: 'website' },
				},
			});
			handleConfigChange('link', validUrl);
			setLinkError(null);
		} catch (error) {
			setLinkError('Please enter a valid URL');
			console.error(error);
		}
	};

	const {
		title = '',
		titleColour = '#000000',
		titleFontSize = 16,
		description = '',
		descriptionColour = '#000000',
		descriptionFontSize = 14,
		label = 'Click "Edit" to configure',
		link = '',
		buttonColour = '#0891b2',
		textColour = '#ffffff',
		backgroundColor = '',
		backgroundImage = '',
		isEdited = false,
	} = element.config;

	return (
		<div className='p-2 mb-4'>
			<h3 className='font-bold text-2xl mb-4'>Call to Action Editor</h3>
			{isEdited && (
				<>
					<p className='font-bold text-xl text-cyan-600 ml-1 mb-1'>
						Live Preview
					</p>
					<div
						className={`p-4 mb-4 min-h-[200px] rounded-lg shadow bg-cover bg-center`}
						style={{
							backgroundColor,
							backgroundImage: backgroundImage
								? `url(${backgroundImage})`
								: undefined,
						}}
					>
						<div className={`p-4 h-full flex flex-col justify-between`}>
							<h2
								className={`mb-3`}
								style={{ color: titleColour, fontSize: titleFontSize }}
							>
								{title}
							</h2>
							<p
								style={{
									color: descriptionColour,
									fontSize: descriptionFontSize,
								}}
							>
								{description}
							</p>
							<button
								style={{ backgroundColor: buttonColour, color: textColour }}
								onClick={() => window.open(link, '_blank')}
								className='px-4 max-w-[300px] py-2 mt-6 rounded shadow'
							>
								{label}
							</button>
						</div>
					</div>
				</>
			)}

			<div className='p-5 shadow rounded bg-zinc-50'>
				<div className='mb-4'>
					<div className='mb-2'>
						<label className='font-medium text-xl'>Title:</label>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<input
							type='text'
							value={title}
							onChange={(e) => handleConfigChange('title', e.target.value)}
							onDragStart={preventDrag}
							draggable
							className='w-full border border-gray-300 rounded px-2 py-1 max-w-[75%]'
						/>
						<button
							onClick={() => setEditingField('title')}
							className='inline-flex items-center p-2 h-[30px] rounded text-white bg-cyan-500 hover:bg-cyan-600'
						>
							Edit
						</button>
					</div>
				</div>
				<div className='mb-4'>
					<div className='mb-2'>
						<label className='font-medium text-xl'>Description:</label>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<textarea
							value={description}
							onChange={(e) =>
								handleConfigChange('description', e.target.value)
							}
							onDragStart={preventDrag}
							draggable
							className='w-full border border-gray-300 rounded px-2 py-1 h-24 max-w-[90%]'
						/>
						<button
							onClick={() => setEditingField('description')}
							className='inline-flex items-center p-2 h-[30px] rounded text-white bg-cyan-500 hover:bg-cyan-600'
						>
							Edit
						</button>
					</div>
				</div>
				<div className='mb-4'>
					<div className='mb-2'>
						<label className='font-medium text-xl'>Button:</label>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<input
							type='text'
							value={label}
							onDragStart={preventDrag}
							onChange={(e) => handleConfigChange('label', e.target.value)}
							draggable
							placeholder='Click Edit to configure'
							className='w-full border border-gray-300 rounded px-2 py-1 max-w-[90%]'
						/>
						<button
							onClick={() => setEditingField('button')}
							className='inline-flex items-center p-2 h-[30px] rounded text-white bg-cyan-500 hover:bg-cyan-600'
						>
							Edit
						</button>
					</div>
				</div>
				<div className='mb-4'>
					<div className='mb-2'>
						<label className='font-medium text-xl'>Background:</label>
					</div>
					<div className='flex flex-row gap-2 items-center'>
						<input
							type='text'
							value={backgroundImage}
							onChange={(e) =>
								handleConfigChange('backgroundImage', e.target.value)
							}
							onDragStart={preventDrag}
							draggable
							placeholder='Edit Background Colour or Image URL'
							className='w-full border border-gray-300 rounded px-2 py-1 max-w-[90%]'
						/>
						<button
							onClick={() => setEditingField('background')}
							className='inline-flex items-center p-2 h-[30px] rounded text-white bg-cyan-500 hover:bg-cyan-600'
						>
							Edit
						</button>
					</div>
				</div>
				<div className='flex justify-end gap-2 mt-6'>
					<button
						onClick={() => setShowDeleteElementModal(true)}
						className='bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600'
					>
						Delete Element
					</button>
				</div>
			</div>
			{editingField && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-4 rounded-lg shadow-lg w-[300px]'>
						<h3 className='mb-4 text-lg font-semibold'>
							{editingField === 'title'
								? 'Edit Title Font'
								: editingField === 'description'
								? 'Edit Description Font'
								: editingField === 'button'
								? 'Edit Button'
								: 'Edit Background'}
						</h3>
						{editingField === 'title' || editingField === 'description' ? (
							<>
								<label className='block mb-1'>Font Colour:</label>
								<div className='flex gap-1 justify-between items-center mb-1'>
									<input
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
								<label className='block mb-1'>Font Size:</label>
								<select
									value={
										editingField === 'title'
											? titleFontSize
											: descriptionFontSize
									}
									onChange={(e) =>
										handleConfigChange(
											editingField === 'title'
												? 'titleFontSize'
												: 'descriptionFontSize',
											parseInt(e.target.value, 10)
										)
									}
									className='block w-full mb-4 border border-gray-300 rounded px-2 py-1'
								>
									{FONT_SIZES.map((size) => (
										<option key={size} value={size}>
											{size}px
										</option>
									))}
								</select>
							</>
						) : editingField === 'button' ? (
							<>
								<label className='block mb-1'>Button Colour:</label>
								<div className='flex gap-1 justify-between items-center mb-1'>
									<input
										type='text'
										value={buttonColour}
										onChange={(e) =>
											handleHexInputChange(e.target.value, 'buttonColour')
										}
										onDragStart={preventDrag}
										draggable
										onBlur={(e) =>
											handleHexInputChange(e.target.value, 'buttonColour')
										}
										className='w-full mb-4 border border-gray-300 rounded px-2 py-1'
									/>
									<input
										type='color'
										value={buttonColour}
										onChange={(e) =>
											handleConfigChange('buttonColour', e.target.value)
										}
										onDragStart={preventDrag}
										draggable
										className='w-[33px] h-[32px] px-0.5 mb-4 border border-gray-300 rounded'
									/>
								</div>
								{hexInputError && (
									<p className='text-red-500 text-sm mb-4'>{hexInputError}</p>
								)}
								<label className='block mb-1'>Button Text Colour:</label>
								<div className='flex gap-1 justify-between items-center mb-1'>
									<input
										type='text'
										value={textColour}
										onChange={(e) =>
											handleHexInputChange(e.target.value, 'textColour')
										}
										onDragStart={preventDrag}
										draggable
										onBlur={(e) =>
											handleHexInputChange(e.target.value, 'textColour')
										}
										className='w-full mb-4 border border-gray-300 rounded px-2 py-1'
									/>
									<input
										type='color'
										value={textColour}
										onChange={(e) =>
											handleConfigChange('textColour', e.target.value)
										}
										onDragStart={preventDrag}
										draggable
										className='w-[33px] h-[32px] px-0.5 mb-4 border border-gray-300 rounded'
									/>
								</div>

								<label className='block mb-1'>Button URL:</label>
								<input
									type='text'
									value={link}
									onChange={handleLinkChange}
									onDragStart={preventDrag}
									draggable
									className='w-full mb-2 border border-gray-300 rounded px-2 py-1'
								/>
								{linkError && (
									<p className='text-rose-500 text-sm mb-2'>{linkError}</p>
								)}
							</>
						) : (
							<>
								<label className='block mb-1'>Background Colour:</label>
								<div className='flex gap-1 justify-between items-center mb-1'>
									<input
										type='text'
										value={backgroundColor}
										onChange={(e) =>
											handleHexInputChange(e.target.value, 'backgroundColor')
										}
										onDragStart={preventDrag}
										draggable
										onBlur={(e) =>
											handleHexInputChange(e.target.value, 'backgroundColor')
										}
										className='w-full mb-4 border border-gray-300 rounded px-2 py-1'
									/>

									<input
										type='color'
										value={backgroundColor}
										onChange={(e) =>
											handleConfigChange('backgroundColor', e.target.value)
										}
										onDragStart={preventDrag}
										draggable
										className='w-[33px] h-[32px] px-0.5 mb-4 border border-gray-300 rounded'
									/>
								</div>
								{hexInputError && (
									<p className='text-red-500 text-sm mb-4'>{hexInputError}</p>
								)}

								<label className='block mb-1'>Background Image URL:</label>
								<input
									type='text'
									value={backgroundImage}
									onChange={(e) =>
										handleConfigChange('backgroundImage', e.target.value)
									}
									onDragStart={preventDrag}
									draggable
									className='w-full mb-4 border border-gray-300 rounded px-2 py-1'
								/>
							</>
						)}
						<div className='flex justify-end space-x-2'>
							<button
								onClick={closeEditModal}
								className='bg-gray-300 px-3 py-1 rounded hover:bg-gray-400'
							>
								Cancel
							</button>
							<button
								onClick={closeEditModal}
								disabled={
									(editingField === 'button' && !!linkError) || !!hexInputError
								}
								className='bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed'
							>
								OK
							</button>
						</div>
					</div>
				</div>
			)}

			{showDeleteElementModal && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-4 rounded shadow-lg w-1/3'>
						<p className='mb-4'>
							Are you sure you want to delete this entire element?
						</p>
						<div className='flex justify-end gap-2'>
							<button
								onClick={() => setShowDeleteElementModal(false)}
								className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
							>
								Cancel
							</button>
							<button
								onClick={handleDeleteElement}
								className='bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600'
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

export default CallToAction;
