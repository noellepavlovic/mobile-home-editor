// Importing necessary libraries and utilities for testing
import '@testing-library/jest-dom'; // Provides custom Jest matchers for asserting on DOM nodes
import { render, fireEvent, screen } from '@testing-library/react'; // Tools for rendering and interacting with components in tests
import { DndProvider } from 'react-dnd'; // Context provider for drag-and-drop functionality
import { HTML5Backend } from 'react-dnd-html5-backend'; // HTML5 drag-and-drop backend for react-dnd

// Importing application components and context
import App from '../App';
import {
	MobileEditorProvider,
	useMobileEditor,
} from '../contexts/MobileEditorContext';

// Mocking the MobileEditorContext to control its behavior during tests
jest.mock('../contexts/MobileEditorContext', () => {
	const originalModule = jest.requireActual('../contexts/MobileEditorContext');
	return {
		...originalModule,
		useMobileEditor: jest.fn(), // Mocking the `useMobileEditor` hook
	};
});

// Test suite for the `App` component
describe('App Component', () => {
	// Setting up a mock implementation of the DataTransfer API before each test
	beforeEach(() => {
		Object.defineProperty(window, 'DataTransfer', {
			writable: true,
			value: class {
				data: Record<string, string> = {};
				setData(type: string, value: string) {
					this.data[type] = value; // Stores data by type
				}
				getData(type: string) {
					return this.data[type]; // Retrieves data by type
				}
			},
		});
	});

	// Test to verify that the LeftPanel and RightPanel components are rendered within the App component
	it('renders LeftPanel and RightPanel components', () => {
		// Mock the return value of the `useMobileEditor` hook
		(useMobileEditor as jest.Mock).mockReturnValue({
			elements: [], // Mock an empty list of elements
			addElement: jest.fn(), // Mock the `addElement` function
		});

		// Render the App component wrapped with necessary providers
		const { container } = render(
			<MobileEditorProvider>
				<DndProvider backend={HTML5Backend}>
					<App />
				</DndProvider>
			</MobileEditorProvider>
		);

		// Select the LeftPanel and RightPanel elements by their IDs
		const leftPanel = container.querySelector('#left-panel');
		const rightPanel = container.querySelector('#right-panel');

		// Verify that both panels are rendered
		expect(leftPanel).not.toBeNull();
		expect(rightPanel).not.toBeNull();
	});

	// Test to verify drag-and-drop functionality from LeftPanel to RightPanel
	it('allows dragging items from LeftPanel to RightPanel', () => {
		// Mock the `addElement` function to track calls
		const mockAddElement = jest.fn();
		(useMobileEditor as jest.Mock).mockReturnValue({
			elements: [], // Mock an empty list of elements
			addElement: mockAddElement, // Use the mock function for `addElement`
		});

		// Render the App component wrapped with necessary providers
		render(
			<MobileEditorProvider>
				<DndProvider backend={HTML5Backend}>
					<App />
				</DndProvider>
			</MobileEditorProvider>
		);

		// Select a draggable item and the drop zone
		const draggableItem = screen.getByText('Text Editor'); // Adjust the text to match your component
		const dropZone = screen.getByTestId('dropzone'); // Use a test ID or other selector

		// Simulate a drag-and-drop action
		const dataTransfer = new DataTransfer();
		fireEvent.dragStart(draggableItem, { dataTransfer }); // Start dragging the item
		fireEvent.dragEnter(dropZone); // Enter the drop zone
		fireEvent.dragOver(dropZone); // Hover over the drop zone
		fireEvent.drop(dropZone, { dataTransfer }); // Drop the item into the drop zone
		fireEvent.dragEnd(draggableItem); // End the drag action

		// Assert that the `addElement` function was called with the correct argument
		expect(mockAddElement).toHaveBeenCalledWith('text-editor');
	});
});
