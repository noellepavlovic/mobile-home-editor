// Import necessary functions and utilities from the testing library
import { render, screen, fireEvent } from '@testing-library/react';
// Import Jest DOM extensions for additional matchers like `toBeInTheDocument`
import '@testing-library/jest-dom';
// Import React DnD's provider and test backend for simulating drag-and-drop functionality
import { DndProvider } from 'react-dnd';
import { TestBackend } from 'react-dnd-test-backend';
// Import the `LeftNav` component to be tested
import LeftNav from '../components/LeftNav';

describe('LeftNav Component', () => {
	// Mock function for toggling the menu's open/close state
	const toggleMenuMock = jest.fn();

	// Utility function to render the component with the React DnD provider
	const renderWithDndProvider = (isMenuOpen: boolean) => {
		render(
			<DndProvider backend={TestBackend}>
				<LeftNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenuMock} />
			</DndProvider>
		);
	};

	// Test for rendering the menu when it is open
	it('renders the menu when it is open', () => {
		renderWithDndProvider(true);

		// Verify that the menu is rendered
		const menuElement = screen.getByText('Elements');
		expect(menuElement).toBeInTheDocument();

		// Verify that the menu container has the correct class for the "open" state
		const menuContainer = screen.getByRole('complementary');
		expect(menuContainer).toHaveClass('translate-x-0');
	});

	// Test for ensuring the menu is hidden when it is closed
	it('does not render the menu when it is closed', () => {
		renderWithDndProvider(false);

		// Verify that the menu container has the correct class for the "closed" state
		const menuContainer = screen.getByRole('complementary');
		expect(menuContainer).toHaveClass('-translate-x-full');
	});

	// Test for verifying that the `toggleMenu` function is called when the "Close" button is clicked
	it('calls the toggleMenu function when "Close" button is clicked', () => {
		renderWithDndProvider(true);

		// Find and click the "Close" button
		const closeButton = screen.getByText('Close');
		fireEvent.click(closeButton);

		// Verify that the `toggleMenuMock` function is called
		expect(toggleMenuMock).toHaveBeenCalledTimes(1);
	});

	// Test for rendering draggable elements in the menu
	it('renders draggable elements', () => {
		renderWithDndProvider(true);

		// Verify that all draggable items are rendered
		expect(screen.getByText('Carousel')).toBeInTheDocument();
		expect(screen.getByText('Text Editor')).toBeInTheDocument();
		expect(screen.getByText('Call to Action')).toBeInTheDocument();

		// Verify that the draggable items have the correct class
		const draggableItems = screen.getAllByText(
			/Carousel|Text Editor|Call to Action/i
		);
		draggableItems.forEach((item) => {
			expect(item).toHaveClass('draggable-item');
		});
	});

	// Test for ensuring draggable elements are functional using React DnD's test backend
	it('draggable elements are draggable (react-dnd functionality)', () => {
		renderWithDndProvider(true);

		// Verify that the "Carousel" item is draggable without throwing errors
		const draggableItem = screen.getByText('Carousel');
		expect(() => fireEvent.dragStart(draggableItem)).not.toThrow();
	});
});
