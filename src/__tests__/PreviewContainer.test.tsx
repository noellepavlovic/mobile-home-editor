// Importing necessary libraries for testing and rendering React components
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

// Importing the `useMobileEditor` hook from the context and `PreviewContainer` component
import { useMobileEditor } from '../contexts/MobileEditorContext';
import PreviewContainer from '../components/PreviewContainer';

// Mock the Carousel component to simulate its behavior in tests
jest.mock('../components/Carousel', () =>
	jest.fn(({ onUpdate, isPreview }) => (
		<div>
			Carousel Component
			<button onClick={() => onUpdate({ updated: true })}>
				Update Carousel
			</button>
			{isPreview && <p>Preview Mode</p>}
		</div>
	))
);

// Mock the `useMobileEditor` hook to control its return values during tests
jest.mock('../contexts/MobileEditorContext', () => ({
	useMobileEditor: jest.fn(),
}));

// Test suite for the `PreviewContainer` component
describe('PreviewContainer Component', () => {
	// Mock functions for `setElements` and `onClose` to track calls during tests
	let mockSetElements: jest.Mock;
	let mockOnClose: jest.Mock;

	beforeEach(() => {
		// Initialize the mock functions before each test
		mockSetElements = jest.fn();
		mockOnClose = jest.fn();

		// Mock the return value of `useMobileEditor`
		(useMobileEditor as jest.Mock).mockReturnValue({
			setElements: mockSetElements,
		});
	});

	afterEach(() => {
		// Clear all mocks after each test to ensure test isolation
		jest.clearAllMocks();
	});

	// Verify that the `Carousel` component is rendered for "carousel" element types
	it('renders the Carousel component when the element type is "carousel"', () => {
		const mockElement = { type: 'carousel', id: '1', config: {} };

		// Render the `PreviewContainer` with a carousel element
		render(<PreviewContainer element={mockElement} onClose={mockOnClose} />);

		// Verify that the `Carousel` component is rendered
		expect(screen.getByText('Carousel Component')).toBeInTheDocument();

		// Verify that the preview mode indicator is rendered
		expect(screen.getByText('Preview Mode')).toBeInTheDocument();
	});

	// Verify that `setElements` is called when the `Carousel` component updates
	it('calls setElements when the Carousel component updates', () => {
		const mockElement = { type: 'carousel', id: '1', config: {} };

		// Render the `PreviewContainer` with a carousel element
		render(<PreviewContainer element={mockElement} onClose={mockOnClose} />);

		// Simulate an update triggered by the `Carousel` component
		const updateButton = screen.getByText('Update Carousel');
		fireEvent.click(updateButton);

		// Verify that `setElements` is called once with an updater function
		expect(mockSetElements).toHaveBeenCalledTimes(1);
		expect(mockSetElements).toHaveBeenCalledWith(expect.any(Function));

		// Simulate calling the updater function and verify the updated state
		const updater = mockSetElements.mock.calls[0][0];
		const updatedState = updater([{ id: '1', type: 'carousel', config: {} }]);
		expect(updatedState).toEqual([
			{ id: '1', type: 'carousel', config: { updated: true } },
		]);
	});

	// Test: Verify that an error message is displayed for unknown element types
	it('renders an error message for an unknown element type', () => {
		const mockElement = { type: 'unknown', id: '2', config: {} };

		// Render the `PreviewContainer` with an unknown element type
		render(<PreviewContainer element={mockElement} onClose={mockOnClose} />);

		// Verify that the error message is displayed
		expect(
			screen.getByText('Unknown element type: unknown')
		).toBeInTheDocument();
	});

	// Verify that `onClose` is called when the "Close Preview" button is clicked
	it('calls the onClose function when "Close Preview" is clicked', () => {
		const mockElement = { type: 'carousel', id: '1', config: {} };

		// Render the `PreviewContainer` with a carousel element
		render(<PreviewContainer element={mockElement} onClose={mockOnClose} />);

		// Simulate clicking the "Close Preview" button
		const closeButton = screen.getByText('Close Preview');
		fireEvent.click(closeButton);

		// Verify that `onClose` is called once
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
