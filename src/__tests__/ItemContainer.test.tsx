// Import Jest DOM extensions to enable additional matchers like `toBeInTheDocument`
import '@testing-library/jest-dom';
// Import necessary functions for rendering, querying, and simulating user interactions
import { render, screen, fireEvent } from '@testing-library/react';

// Import the `useMobileEditor` context and the `ItemContainer` component to be tested
import { useMobileEditor } from '../contexts/MobileEditorContext';
import ItemContainer from '../components/ItemContainer';

// Mock the `useMobileEditor` hook to control its behavior during tests
jest.mock('../contexts/MobileEditorContext', () => ({
	useMobileEditor: jest.fn(),
}));

// Mock child components used by `ItemContainer`
jest.mock('../components/TextEditor', () =>
	jest.fn(() => <div>TextEditor Component</div>)
);
jest.mock('../components/Carousel', () =>
	jest.fn(({ onUpdate }) => (
		<div>
			Carousel Component
			<button onClick={() => onUpdate({ updated: true })}>
				Update Carousel
			</button>
		</div>
	))
);
jest.mock('../components/CallToAction', () =>
	jest.fn(() => <div>CallToAction Component</div>)
);

describe('ItemContainer Component', () => {
	// Mock function to simulate state updates in the `useMobileEditor` context
	let mockSetElements: jest.Mock;

	// Reset mocks before each test
	beforeEach(() => {
		mockSetElements = jest.fn();
		(useMobileEditor as jest.Mock).mockReturnValue({
			elements: [],
			setElements: mockSetElements,
		});
	});

	// Clear all mock data after each test
	afterEach(() => {
		jest.clearAllMocks();
	});

	// Test for rendering the `TextEditor` component when the element type is "text-editor"
	it('renders the TextEditor component when the element type is "text-editor"', () => {
		render(<ItemContainer element={{ type: 'text-editor' }} index={0} />);

		// Verify that the `TextEditor` component is rendered
		expect(screen.getByText('TextEditor Component')).toBeInTheDocument();
	});

	// Test for rendering the `Carousel` component when the element type is "carousel"
	it('renders the Carousel component when the element type is "carousel"', () => {
		render(<ItemContainer element={{ type: 'carousel' }} index={0} />);

		// Verify that the `Carousel` component is rendered
		expect(screen.getByText('Carousel Component')).toBeInTheDocument();
	});

	// Test for rendering the `CallToAction` component when the element type is "call-to-action"
	it('renders the CallToAction component when the element type is "call-to-action"', () => {
		render(<ItemContainer element={{ type: 'call-to-action' }} index={0} />);

		// Verify that the `CallToAction` component is rendered
		expect(screen.getByText('CallToAction Component')).toBeInTheDocument();
	});

	// Test for rendering an error message when the element type is unknown
	it('renders an error message when the element type is unknown', () => {
		render(<ItemContainer element={{ type: 'unknown-type' }} index={0} />);

		// Verify that an error message is displayed for unknown element types
		expect(screen.getByText('Unknown element type')).toBeInTheDocument();
	});

	// Test for verifying that `setElements` is called when the `Carousel` component updates
	it('calls setElements when the Carousel component updates', () => {
		const mockElement = { type: 'carousel', config: {} };

		// Mock the context to include a `Carousel` element
		(useMobileEditor as jest.Mock).mockReturnValue({
			elements: [mockElement],
			setElements: mockSetElements,
		});

		render(<ItemContainer element={mockElement} index={0} />);

		// Simulate clicking the "Update Carousel" button in the `Carousel` component
		const updateButton = screen.getByText('Update Carousel');
		fireEvent.click(updateButton);

		// Verify that `setElements` was called with the updated element configuration
		expect(mockSetElements).toHaveBeenCalledTimes(1);
		expect(mockSetElements).toHaveBeenCalledWith([
			{ ...mockElement, config: { updated: true } },
		]);
	});
});
