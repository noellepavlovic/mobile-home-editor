// Import necessary libraries and testing utilities
import '@testing-library/jest-dom'; // Extends Jest with custom matchers for DOM nodes
import { render, screen, fireEvent, within } from '@testing-library/react'; // Functions for rendering and interacting with components during tests

// Import the component being tested
import TextEditor from '../components/TextEditor';

// Mock the `useMobileEditor` hook to control its behavior in the test environment
const mockSetElements = jest.fn(); // Mock function to simulate `setElements` updates
const mockElements = [
	{
		config: {
			title: 'Test Title', // Default title for the text editor
			description: 'Test Description', // Default description
			titleColour: '#000000', // Default title colour
			titleFontSize: 16, // Default title font size
			descriptionColour: '#000000', // Default description colour
			descriptionFontSize: 14, // Default description font size
			isEdited: false, // Indicates if the element has been edited
		},
	},
];

// Mock the `MobileEditorContext` to provide mock data and functions
jest.mock('../contexts/MobileEditorContext', () => ({
	useMobileEditor: () => ({
		elements: mockElements, // Mock the current elements in the editor
		setElements: mockSetElements, // Mock the `setElements` function
	}),
}));

// Test suite for the `TextEditor` component
describe('TextEditor component', () => {
	// Clear mock function calls after each test to ensure isolation
	afterEach(() => {
		jest.clearAllMocks();
	});

	// Default props for rendering the component
	const defaultProps = { index: 0, element: mockElements[0] };

	//  Verify the title input and modal functionality
	it('renders title input and opens title modal', async () => {
		render(<TextEditor {...defaultProps} />);

		// Simulate clicking the "Edit Title" button
		fireEvent.click(screen.getByLabelText('Edit Title'));

		// Verify the title modal is displayed
		expect(screen.getByText('Edit Title Font')).toBeInTheDocument();

		// Simulate changing the title font colour
		const colorInput = screen.getByLabelText('Colour (Hex)');
		fireEvent.change(colorInput, { target: { value: '#123456' } });

		// Verify the `setElements` function is called
		expect(mockSetElements).toHaveBeenCalled();

		// Simulate closing the modal
		fireEvent.click(screen.getByLabelText('Cancel'));
		expect(screen.queryByText('Edit Title Font')).not.toBeInTheDocument();
	});

	//  Verify the description input and modal functionality
	it('renders description input and opens description modal', async () => {
		render(<TextEditor {...defaultProps} />);

		// Simulate clicking the "Edit Description" button
		fireEvent.click(screen.getByLabelText('Edit Description'));

		// Verify the description modal is displayed
		expect(screen.getByText('Edit Description Font')).toBeInTheDocument();

		// Simulate changing the description font size
		const fontSizeSelect = screen.getByLabelText('Font Size');
		fireEvent.change(fontSizeSelect, { target: { value: '18' } });

		// Verify the `setElements` function is called
		expect(mockSetElements).toHaveBeenCalled();

		// Simulate closing the modal
		fireEvent.click(screen.getByLabelText('Cancel'));
		expect(screen.queryByText('Edit Description Font')).not.toBeInTheDocument();
	});

	//  Verify the delete confirmation modal and element deletion
	it('renders delete confirmation modal and deletes element', async () => {
		// Mock the initial state of elements
		const mockElements = [
			{
				config: {
					title: 'Test Title',
					description: 'Test Description',
					titleColour: '#000000',
					titleFontSize: 16,
					descriptionColour: '#000000',
					descriptionFontSize: 14,
					isEdited: false,
				},
			},
		];

		// Mock `setElements` to update the elements array
		mockSetElements.mockImplementation((callback) => {
			const updatedElements = callback(mockElements);
			mockElements.splice(0, mockElements.length, ...updatedElements);
		});

		// Render the component
		render(<TextEditor {...defaultProps} />);

		// Simulate opening the delete modal
		fireEvent.click(screen.getByLabelText('Delete Element 1'));
		expect(
			screen.getByText('Are you sure you want to delete this element?')
		).toBeInTheDocument();

		// Simulate confirming the deletion
		fireEvent.click(screen.getByLabelText('Delete Element 2'));

		// Verify `setElements` is called and the elements array is updated
		expect(mockSetElements).toHaveBeenCalled();
		expect(mockElements).toEqual([]); // Ensure the elements array is now empty
	});

	//  Verify the live preview renders with correct properties
	it('renders the live preview with correct properties', () => {
		const mockElement = {
			config: {
				title: 'Test Title', // Title for live preview
				description: 'Test Description', // Description for live preview
				titleColour: '#000000',
				titleFontSize: 16,
				descriptionColour: '#000000',
				descriptionFontSize: 14,
				isEdited: true, // Enable live preview
			},
		};

		// Render the component with live preview enabled
		render(<TextEditor element={mockElement} index={0} />);

		// Verify the live preview container is rendered
		const livePreview = screen.getByText('Live Preview').closest('div');
		if (!livePreview) {
			throw new Error('Live preview container not found');
		}

		// Verify the title is displayed in the live preview
		expect(
			within(livePreview).getByText(
				(_, element) => element?.textContent === 'Test Title'
			)
		).toBeInTheDocument();

		// Verify the description is displayed in the live preview
		expect(
			within(livePreview).getByText(
				(_, element) =>
					element?.tagName === 'P' && element.textContent === 'Test Description'
			)
		).toBeInTheDocument();
	});
});
