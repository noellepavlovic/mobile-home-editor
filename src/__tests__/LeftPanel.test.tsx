// Import Jest DOM extensions to enable additional matchers like `toBeInTheDocument`
import '@testing-library/jest-dom';
// Import testing utilities for rendering components and querying DOM elements
import { render, screen } from '@testing-library/react';
// Import React DnD's provider and test backend for simulating drag-and-drop functionality
import { DndProvider } from 'react-dnd';
import { TestBackend } from 'react-dnd-test-backend';

// Import the `LeftPanel` component to be tested
import LeftPanel from '../components/LeftPanel';

describe('LeftPanel', () => {
	// Test case for rendering the heading and draggable elements
	it('renders the heading and elements', () => {
		// Render the `LeftPanel` component wrapped in the React DnD provider with the test backend
		render(
			<DndProvider backend={TestBackend}>
				<LeftPanel />
			</DndProvider>
		);

		// Verify that the heading "Elements" is rendered
		expect(screen.getByText('Elements')).toBeInTheDocument();

		// Verify that the draggable elements are rendered with their respective labels
		expect(screen.getByText('Carousel')).toBeInTheDocument();
		expect(screen.getByText('Text Editor')).toBeInTheDocument();
		expect(screen.getByText('Call to Action')).toBeInTheDocument();
	});
});
