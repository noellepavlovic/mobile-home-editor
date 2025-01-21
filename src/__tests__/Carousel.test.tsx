import React from 'react'; // Import React for building the component and test JSX
import '@testing-library/jest-dom'; // Import Jest DOM extensions for testing-library
import {
	render,
	fireEvent,
	screen,
	waitFor,
	within,
} from '@testing-library/react'; // Import methods for rendering, simulating events, and querying DOM

import Carousel from '../components/Carousel'; // Import the Carousel component to test
import { MobileEditorProvider } from '../contexts/MobileEditorContext'; // Import the MobileEditor context for wrapping the component in its provider

// Mocking `onUpdate` function to track updates to the Carousel component
const mockOnUpdate = jest.fn();

// Mock data for the Carousel element, representing its initial configuration
const mockElement = {
	id: '1',
	type: 'carousel',
	config: {
		images: [
			{
				url: 'https://via.placeholder.com/300x200', // Placeholder image URL
				title: 'Image 1', // Title for the first image
				description: 'Description 1', // Description for the first image
			},
		],
		view: 'landscape' as 'landscape' | 'portrait' | 'square', // Initial view mode
	},
};

// Utility function to render a component wrapped with `MobileEditorProvider`
const renderWithProvider = (ui: React.ReactNode) =>
	render(<MobileEditorProvider>{ui}</MobileEditorProvider>);

describe('Carousel', () => {
	// Reset mock function calls before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Test for rendering the component with initial images
	it('renders component with initial images', () => {
		renderWithProvider(
			<Carousel element={mockElement} onUpdate={mockOnUpdate} />
		);

		// Verify that the image title and description are displayed
		expect(screen.getByText('Image 1')).toBeInTheDocument();
		expect(screen.getByText('Description 1')).toBeInTheDocument();
	});

	// Test for opening the "Add Image" modal
	it('opens "Add Image" modal when clicking "Add Image"', () => {
		renderWithProvider(
			<Carousel element={mockElement} onUpdate={mockOnUpdate} />
		);

		// Simulate clicking the "Add Image" button
		fireEvent.click(
			screen.getByText('Add Image', { selector: '.bg-teal-500' })
		);

		// Verify that the modal content is displayed
		expect(screen.getByText('Add New Image')).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Image URL/i)).toBeInTheDocument();
	});

	// Test for updating the view mode via radio buttons
	it('updates view mode when selecting a new radio button', () => {
		renderWithProvider(
			<Carousel element={mockElement} onUpdate={mockOnUpdate} />
		);

		// Simulate selecting the "Portrait" radio button
		fireEvent.click(screen.getByLabelText('Portrait'));

		// Verify that `onUpdate` is called with the updated view mode
		expect(mockOnUpdate).toHaveBeenCalledWith({
			...mockElement.config,
			view: 'portrait', // New view mode
		});
	});

	// Test for editing an image via the edit modal
	it('opens edit modal when clicking "Edit" on an image', () => {
		renderWithProvider(
			<Carousel element={mockElement} onUpdate={mockOnUpdate} />
		);

		// Simulate clicking the "Edit" button
		fireEvent.click(screen.getByText('Edit'));

		// Verify that the edit modal content is displayed
		expect(screen.getByPlaceholderText(/Image URL/i)).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/Image Title/i)).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText(/Image Description/i)
		).toBeInTheDocument();
	});

	// Test for adding a new image with valid inputs
	it('adds a new image if URL is valid', async () => {
		renderWithProvider(
			<Carousel element={mockElement} onUpdate={mockOnUpdate} />
		);

		// Simulate opening the "Add Image" modal
		fireEvent.click(
			screen.getByText('Add Image', { selector: '.bg-teal-500' })
		);

		// Simulate filling out the form fields
		fireEvent.change(screen.getByPlaceholderText(/Image URL/i), {
			target: { value: 'https://test.url' }, // Valid URL
		});
		fireEvent.change(screen.getByPlaceholderText(/Image Title/i), {
			target: { value: 'New Title' }, // New title
		});
		fireEvent.change(screen.getByPlaceholderText(/Image Description/i), {
			target: { value: 'New Description' }, // New description
		});

		// Locate and click the "Add Image" button within the modal
		const modal = screen.getByText('Add New Image').closest('div');
		if (!modal) throw new Error('Modal not found'); // Ensure modal exists
		const addButton = within(modal).getByText('Add Image');
		fireEvent.click(addButton);

		// Verify that `onUpdate` is called with the updated images list
		await waitFor(() => {
			expect(mockOnUpdate).toHaveBeenCalledWith({
				...mockElement.config,
				images: [
					...mockElement.config.images, // Preserve existing images
					{
						url: 'https://test.url', // New image URL
						title: 'New Title', // New image title
						description: 'New Description', // New image description
					},
				],
			});
		});
	});
});
