// Importing necessary libraries and utilities for testing
import '@testing-library/jest-dom'; // Extends Jest with custom matchers for DOM nodes
import { render, screen } from '@testing-library/react'; // Provides functions to render components and query the DOM
import { DndProvider } from 'react-dnd'; // React DnD context provider for drag-and-drop functionality
import { HTML5Backend } from 'react-dnd-html5-backend'; // Backend for HTML5 drag-and-drop API

// Importing the `useMobileEditor` hook and `RightPanel` component
import { useMobileEditor } from '../contexts/MobileEditorContext';
import RightPanel from '../components/RightPanel';

// Mocking the `MobileEditorContext` to control its behavior during tests
jest.mock('../contexts/MobileEditorContext', () => ({
	useMobileEditor: jest.fn(),
}));

// Mocking drag-and-drop hooks from `react-dnd` to simulate their behavior in tests
jest.mock('react-dnd', () => {
	const originalModule = jest.requireActual('react-dnd'); // Retain the original module's implementation
	return {
		...originalModule, // Spread the original module
		useDrag: jest.fn(() => [{ isDragging: false }, jest.fn()]), // Mock `useDrag`
		useDrop: jest.fn(() => [jest.fn(), { isOver: false }]), // Mock `useDrop`
	};
});

// Test suite for the `RightPanel` component
describe('RightPanel', () => {
	// Clear all mock calls before each test to ensure test isolation
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// Verify that the `RightPanel` component renders provided elements correctly
	it('renders the provided elements correctly', () => {
		// Mocking the return value of the `useMobileEditor` hook
		(useMobileEditor as jest.Mock).mockReturnValue({
			addElement: jest.fn(), // Mock the `addElement` function
		});

		// Mock data for elements passed to the `RightPanel` component
		const elements = [
			{
				id: 'element-1',
				type: 'carousel',
				config: {
					images: [
						{ url: 'https://picsum.photos/800/600?image=1', alt: 'Image 1' },
						{ url: 'https://picsum.photos/800/600?image=2', alt: 'Image 2' },
					],
					view: 'landscape', // Specifies the view mode
				},
			},
			{
				id: 'element-2',
				type: 'text-editor',
				config: {
					title: 'Title', // Title text for the text editor
					description: 'Sample Description', // Description for the text editor
					titleColour: '#000000', // Colour of the title
					titleFontSize: 16, // Font size of the title
				},
			},
		];

		// Rendering the `RightPanel` component with mock data wrapped in the DnD provider
		render(
			<DndProvider backend={HTML5Backend}>
				<RightPanel elements={elements} />
			</DndProvider>
		);

		// Verify that the description of the text editor is rendered
		expect(screen.getByText('Sample Description')).toBeInTheDocument();
	});
});
