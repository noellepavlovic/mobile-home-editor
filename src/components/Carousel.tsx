import '../styles/Carousel.css';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { validateURL } from '../helpers/validateURL';
import PreviewContainer from './PreviewContainer';
import { preventDrag } from '../helpers/preventDrag';
import { useMobileEditor } from '../contexts/MobileEditorContext';

interface ImageItem {
	url: string;
	title: string;
	description: string;
}

interface CarouselProps {
	element: {
		id: string;
		type: string;
		config: {
			images: ImageItem[];
			view: 'landscape' | 'portrait' | 'square';
		};
	};
	onUpdate: (updatedConfig: any) => void;
	isPreview?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
	element,
	onUpdate,
	isPreview = false,
}) => {
	const { elements, setElements } = useMobileEditor();
	console.log('Carousel elements:', elements);

	const [images, setImages] = useState(element.config.images);
	const [view, setView] = useState(element.config.view);
	const [isPreviewing, setIsPreviewing] = useState(false);

	useEffect(() => {
		const found = elements.find((el) => el.id === element.id);
		if (found) {
			setImages(found.config.images);
			setView(found.config.view);
		}
	}, [elements, element.id]);

	const [showEditModal, setShowEditModal] = useState(false);
	const [editImage, setEditImage] = useState<{
		index: number;
		url: string;
		title: string;
		description: string;
	} | null>(null);
	const [editImageUrlError, setEditImageUrlError] = useState<string | null>(
		null
	);

	const [showAddImageModal, setShowAddImageModal] = useState(false);
	const [newImage, setNewImage] = useState<ImageItem>({
		url: '',
		title: '',
		description: '',
	});
	const [addImageUrlError, setAddImageUrlError] = useState<string | null>(null);

	const [swiperInstance, setSwiperInstance] = useState<any>(null);

	const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

	const [showDeleteElementModal, setShowDeleteElementModal] = useState(false);

	const applyImagesUpdate = (updatedImages: ImageItem[]) => {
		setImages(updatedImages);

		onUpdate({ ...element.config, images: updatedImages });

		setElements((prev) => {
			const cloned = [...prev];
			const idx = cloned.findIndex((el) => el.id === element.id);
			if (idx !== -1) {
				cloned[idx].config.images = updatedImages;
			}
			return cloned;
		});
	};

	const applyViewUpdate = (newView: 'landscape' | 'portrait' | 'square') => {
		setView(newView);
		onUpdate({ ...element.config, view: newView });

		setElements((prev) => {
			const cloned = [...prev];
			const i = cloned.findIndex((el) => el.id === element.id);
			if (i !== -1) {
				cloned[i].config.view = newView;
			}
			return cloned;
		});
	};

	const handleNewImageUrlChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setNewImage((prev) => ({ ...prev, url: value }));

		try {
			const validUrl = await validateURL({
				args: {
					value,
					siblingData: { type: 'website' },
				},
			});
			setNewImage((prev) => ({ ...prev, url: validUrl }));
			setAddImageUrlError(null);
		} catch (error) {
			setAddImageUrlError('Please enter a valid URL');
			console.error(error);
		}
	};

	const handleAddImage = () => {
		const updatedImages = [
			...images,
			{
				url:
					!addImageUrlError && newImage.url
						? newImage.url
						: 'https://via.placeholder.com/300x200?text=New+Image',
				title: newImage.title || 'New Title',
				description: newImage.description || 'New Description',
			},
		];

		applyImagesUpdate(updatedImages);

		setShowAddImageModal(false);
		setNewImage({ url: '', title: '', description: '' });
		setAddImageUrlError(null);

		if (swiperInstance) {
			setTimeout(() => swiperInstance.slideTo(updatedImages.length - 1), 100);
		}
	};

	const handleEditImageUrlChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!editImage) return;
		const value = e.target.value;
		setEditImage((prev) => (prev ? { ...prev, url: value } : null));

		try {
			const validUrl = await validateURL({
				args: {
					value,
					siblingData: { type: 'website' },
				},
			});
			setEditImage((prev) => (prev ? { ...prev, url: validUrl } : null));
			setEditImageUrlError(null);
		} catch (error) {
			setEditImageUrlError('Please enter a valid URL');
			console.error(error);
		}
	};

	const handleSaveEdit = () => {
		if (!editImage) return;

		const updatedImages = images.map((img, idx) =>
			idx === editImage.index
				? {
						url: !editImageUrlError && editImage.url ? editImage.url : img.url,
						title: editImage.title,
						description: editImage.description,
				  }
				: img
		);

		applyImagesUpdate(updatedImages);

		setShowEditModal(false);
		setEditImage(null);
		setEditImageUrlError(null);
	};

	const handleDeletePrompt = () => setShowDeleteConfirmModal(true);

	const handleDeleteImage = () => {
		if (!editImage) return;
		const updatedImages = images.filter((_, idx) => idx !== editImage.index);

		applyImagesUpdate(updatedImages);

		setShowDeleteConfirmModal(false);
		setShowEditModal(false);
		setEditImage(null);
		setEditImageUrlError(null);
	};

	const handleDeleteElement = () => {
		setElements((prev) => prev.filter((el) => el.id !== element.id));
		setShowDeleteElementModal(false);
	};

	const handleViewChange = (newView: 'landscape' | 'portrait' | 'square') => {
		applyViewUpdate(newView);
	};

	if (isPreviewing) {
		return (
			<PreviewContainer
				element={element}
				onClose={() => setIsPreviewing(false)}
			/>
		);
	}

	return (
		<>
			<h3 className='font-bold text-2xl mb-3'>"Carousel" Element Editor</h3>
			<div className={`carousel-container  ${view}`}>
				<Swiper
					modules={[Navigation, Pagination]}
					navigation={true}
					pagination={isPreview ? false : { clickable: true }}
					spaceBetween={20}
					slidesPerView={1}
					className='swiper-container'
					onSwiper={(swiper) => setSwiperInstance(swiper)}
				>
					{images.map((image, index) => (
						<SwiperSlide
							key={index}
							className={`carousel-slide ${
								view === 'landscape'
									? 'landscape w-full aspect-[4/3]'
									: view === 'portrait'
									? 'portrait w-full aspect-[3/4]'
									: 'square w-full aspect-[1/1]'
							}`}
						>
							<img
								src={image.url}
								alt={`Slide ${index + 1}`}
								className={`object-cover ${
									view === 'landscape'
										? 'w-full h-full'
										: view === 'portrait'
										? 'w-auto h-full'
										: 'w-auto h-auto'
								}`}
							/>
							{!isPreview && (
								<div className='flex flex-col justify-between h-auto min-h-[125px] max-w-[300px] min-w-[100] w-auto absolute bottom-4 left-0  m-5 bg-white p-2 rounded shadow'>
									<p className='text-sm font-bold mb-4'>{image.title}</p>
									<p className='text-xs text-gray-500 mb-4'>
										{image.description}
									</p>
									<button
										onClick={() => {
											setEditImage({ index, ...image });
											setShowEditModal(true);
										}}
										className='bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 transition text-base'
									>
										Edit
									</button>
								</div>
							)}
						</SwiperSlide>
					))}
				</Swiper>

				{!isPreview && (
					<>
						<div className='flex flex-row flex-wrap justify-between'>
							<div className='mt-4 flex flex-row flex-wrap gap-2'>
								<span className='text-sm font-bold mt-0'>Mode:</span>
								{(['landscape', 'portrait', 'square'] as const).map((mode) => (
									<label
										key={mode}
										className='flex items-center text-sm font-medium'
									>
										<input
											type='radio'
											value={mode}
											checked={view === mode}
											onChange={() => handleViewChange(mode)}
											className='text-cyan-500 mr-1'
										/>
										{mode.charAt(0).toUpperCase() + mode.slice(1)}
									</label>
								))}
							</div>

							<div className='flex flex-wrap items-center gap-4 mt-4 self-end'>
								<button
									onClick={() => setShowAddImageModal(true)}
									className=' bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-600 transition text-base'
								>
									Add Image
								</button>
								<button
									onClick={() => setIsPreviewing(true)}
									className='bg-indigo-400 text-white px-3 py-1 rounded hover:bg-indigo-500 text-base'
								>
									Preview
								</button>

								<button
									onClick={() => setShowDeleteElementModal(true)}
									className='bg-rose-500 text-white px-3 py-1 rounded hover:bg-rose-600 text-base'
								>
									Delete Element
								</button>
							</div>
						</div>
					</>
				)}

				{showAddImageModal && (
					<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
						<div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
							<h3 className='text-lg font-bold mb-4'>Add New Image</h3>
							<input
								type='text'
								placeholder='Image URL'
								value={newImage.url}
								onChange={handleNewImageUrlChange}
								onDragStart={preventDrag}
								draggable
								className='w-full border border-gray-300 rounded p-2 mb-2'
							/>
							{addImageUrlError && (
								<p className='text-rose-500 text-sm mb-2'>{addImageUrlError}</p>
							)}
							{!addImageUrlError && newImage.url && (
								<div className='flex flex-row justify-center mb-4'>
									<img
										src={newImage.url}
										alt='Preview'
										className='max-h-96 rounded shadow'
									/>
								</div>
							)}
							<input
								type='text'
								placeholder='Image Title'
								value={newImage.title}
								onChange={(e) =>
									setNewImage((prev) => ({ ...prev, title: e.target.value }))
								}
								onDragStart={preventDrag}
								draggable
								className='w-full border border-gray-300 rounded p-2 mb-2'
							/>
							<input
								type='text'
								placeholder='Image Description'
								value={newImage.description}
								onChange={(e) =>
									setNewImage((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								onDragStart={preventDrag}
								draggable
								className='w-full border border-gray-300 rounded p-2 mb-4'
							/>
							<div className='flex justify-end gap-2'>
								<button
									onClick={() => {
										setShowAddImageModal(false);
										setAddImageUrlError(null);
									}}
									className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
								>
									Cancel
								</button>
								<button
									onClick={handleAddImage}
									className='bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600'
								>
									Add Image
								</button>
							</div>
						</div>
					</div>
				)}

				{showEditModal && editImage && (
					<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
						<div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
							<h3 className='text-lg font-bold mb-4'>Edit Image</h3>
							<input
								type='text'
								placeholder='Image URL'
								value={editImage.url}
								onChange={handleEditImageUrlChange}
								onDragStart={preventDrag}
								draggable
								className='w-full border border-gray-300 rounded p-2 mb-2'
							/>
							{editImageUrlError && (
								<p className='text-rose-500 text-sm mb-2'>
									{editImageUrlError}
								</p>
							)}
							{!editImageUrlError && editImage.url && (
								<div className='mb-4 flex flex-row justify-center '>
									<img
										src={editImage.url}
										alt='Preview'
										className='max-h-96 rounded shadow'
									/>
								</div>
							)}
							<input
								type='text'
								placeholder='Image Title'
								value={editImage.title}
								onChange={(e) =>
									setEditImage((prev) =>
										prev ? { ...prev, title: e.target.value } : null
									)
								}
								onDragStart={preventDrag}
								draggable
								className='w-full border border-gray-300 rounded p-2 mb-4'
							/>
							<input
								type='text'
								placeholder='Image Description'
								value={editImage.description}
								onChange={(e) =>
									setEditImage((prev) =>
										prev ? { ...prev, description: e.target.value } : null
									)
								}
								onDragStart={preventDrag}
								draggable
								className='w-full border border-gray-300 rounded p-2 mb-4'
							/>
							<div className='flex justify-end gap-2'>
								<button
									onClick={handleDeletePrompt}
									className='bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600'
								>
									Delete Image
								</button>
								<button
									onClick={() => {
										setShowEditModal(false);
										setEditImage(null);
										setEditImageUrlError(null);
									}}
									className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
								>
									Cancel
								</button>
								<button
									onClick={handleSaveEdit}
									disabled={!editImage.url || !!editImageUrlError}
									className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
								>
									Save
								</button>
							</div>
						</div>
					</div>
				)}

				{showDeleteConfirmModal && (
					<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
						<div className='bg-white p-4 rounded shadow-lg w-[300px] min-w-[250px]'>
							<p className='mb-4'>
								Are you sure you want to delete this image?
							</p>
							<div className='flex justify-end gap-2'>
								<button
									onClick={() => setShowDeleteConfirmModal(false)}
									className='bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600'
								>
									Cancel
								</button>
								<button
									onClick={handleDeleteImage}
									className='bg-rose-500 text-white px-2 py-2 rounded hover:bg-rose-600'
								>
									Confirm Delete
								</button>
							</div>
						</div>
					</div>
				)}

				{showDeleteElementModal && (
					<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
						<div className='bg-white p-4 m2 rounded shadow-lg w-[300px] min-w-[250px]'>
							<p className='mb-4'>
								Are you sure you want to delete this entire carousel element?
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
		</>
	);
};

export default Carousel;
