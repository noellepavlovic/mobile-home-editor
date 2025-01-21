// Importing necessary libraries and utilities for testing
import '@testing-library/jest-dom'; // Provides custom Jest matchers for verifying on DOM nodes
import { render, screen, fireEvent } from '@testing-library/react'; // Tools for rendering and interacting with components in tests

// Importing the component to be tested
import CallToAction from '../components/CallToAction';

// Mocking `setElements` function for use in the MobileEditorContext
const mockSetElements = jest.fn();
jest.mock('../contexts/MobileEditorContext', () => ({
	useMobileEditor: () => ({ setElements: mockSetElements }), // Mock implementation of `useMobileEditor`
}));

// Mocking helper functions to control their behavior during tests
jest.mock('../helpers/preventDrag', () => ({ preventDrag: jest.fn() })); // Mock `preventDrag`
jest.mock('../helpers/validateURL', () => ({
	validateURL: jest.fn(({ args }) => {
		// Custom logic to simulate URL validation
		if (!args.value.startsWith('http')) {
			return Promise.reject('Invalid URL'); // Reject if URL is invalid
		}
		return Promise.resolve(args.value); // Resolve if URL is valid
	}),
}));

// Test suite for the `CallToAction` component
describe('CallToAction component', () => {
	// Default props to be passed to the component in each test
	const defaultProps = {
		element: {
			config: {
				title: 'Test Title',
				titleColour: '#000000',
				titleFontSize: 16,
				description: 'Test Description',
				descriptionColour: '#000000',
				descriptionFontSize: 14,
				label: 'Click "Edit" to configure',
				link: '',
				buttonColour: '#0891b2',
				textColour: '#ffffff',
				backgroundColor: '',
				backgroundImage: '',
				isEdited: false,
			},
		},
		index: 0, // Component index
	};

	// Clear all mocks before each test to ensure no state is carried over
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Test for validating and applying a valid hex colour for the title
	it('validates and applies valid hex color for title', () => {
		// Render the component with default props
		render(<CallToAction {...defaultProps} />);

		// Open the modal to edit the title
		fireEvent.click(screen.getByLabelText('Edit Title Font'));
		expect(screen.getByText('Edit Title Font')).toBeInTheDocument(); // Verify that modal opens

		// Simulate entering a new valid hex colour
		const colorInput = screen.getByLabelText('Title Colour');
		fireEvent.change(colorInput, { target: { value: '#123456' } });
		fireEvent.blur(colorInput); // Trigger validation on blur

		// Verify `setElements` was called
		expect(mockSetElements).toHaveBeenCalled();

		// Retrieve the function passed to `setElements` and apply a mock previous state
		const elementsUpdater = mockSetElements.mock.calls[0][0];
		expect(elementsUpdater).toBeInstanceOf(Function);

		const mockPreviousState = [
			{
				config: {
					titleColour: '#000000', // Initial title colour
					isEdited: false,
				},
			},
		];

		// Execute the updater function and verify the updated state
		const updatedState = elementsUpdater(mockPreviousState);
		expect(updatedState[0].config.titleColour).toBe('#123456'); // New title colour
		expect(updatedState[0].config.isEdited).toBe(true); // Marked as edited

		// Verify that no error message is displayed
		expect(screen.queryByText('Invalid hex code.')).not.toBeInTheDocument();
	});

	// Test for validating and applying a valid hex colour for the background
	it('validates and applies valid hex color for background', () => {
		// Render the component with default props
		render(<CallToAction {...defaultProps} />);

		// Open the modal to edit the background
		fireEvent.click(screen.getByLabelText('Edit Background'));
		expect(screen.getByText('Edit Background')).toBeInTheDocument(); // Verify that modal opens

		// Simulate entering a new valid hex colour for the background
		const bgColorInput = screen.getByLabelText('Background Colour');
		fireEvent.change(bgColorInput, { target: { value: '#654321' } });
		fireEvent.blur(bgColorInput); // Trigger validation on blur

		// Verify `setElements` was called
		expect(mockSetElements).toHaveBeenCalledTimes(1);
		expect(mockSetElements.mock.calls[0][0]).toBeInstanceOf(Function);

		// Verify that no error message is displayed
		expect(screen.queryByText('Invalid hex code.')).not.toBeInTheDocument();
	});

	// Test for validating and applying a valid URL for the background image
	it('validates and applies valid URL for background image', async () => {
		// Render the component with default props
		render(<CallToAction {...defaultProps} />);

		// Open the modal to edit the background
		fireEvent.click(screen.getByLabelText('Edit Background'));
		expect(screen.getByText('Edit Background')).toBeInTheDocument(); // Verify that modal opens

		// Simulate entering a valid URL for the background image
		const bgImageInput = screen.getByLabelText('Background Image URL');
		fireEvent.change(bgImageInput, { target: { value: 'https://test.url' } });
		fireEvent.blur(bgImageInput); // Trigger validation on blur

		// Verify `setElements` was called
		expect(mockSetElements).toHaveBeenCalledTimes(1);
		expect(mockSetElements.mock.calls[0][0]).toBeInstanceOf(Function);

		// Verify that no error message is displayed
		expect(screen.queryByText('Invalid URL')).not.toBeInTheDocument();
	});
});
