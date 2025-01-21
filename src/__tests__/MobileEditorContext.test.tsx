// Import React for JSX components
import React from 'react';
// Import Jest DOM for additional matchers like `toBeInTheDocument`
import '@testing-library/jest-dom';
// Import testing utilities for rendering components and simulating events
import { render, screen, act } from '@testing-library/react';

// Import MobileEditorContext and its provider for testing the context functionality
import {
	MobileEditorProvider,
	useMobileEditor,
} from '../contexts/MobileEditorContext';

// Mock implementation for `localStorage`
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: (key: string) => store[key] || null, // Mock getItem method
		setItem: (key: string, value: string) => {
			store[key] = value; // Mock setItem method
		},
		clear: () => {
			store = {}; // Mock clear method
		},
	};
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock }); // Mock the window.localStorage object

// Test component to validate the functionality of MobileEditorContext
const TestComponent: React.FC = () => {
	const { elements, addElement } = useMobileEditor(); // Use context to access state and methods

	return (
		<div>
			{/* Button to add a new element */}
			<button onClick={() => addElement('text-editor')}>Add Text Editor</button>
			{/* Display the list of elements */}
			<ul>
				{elements.map((el) => (
					<li key={el.id}>{el.type}</li>
				))}
			</ul>
		</div>
	);
};

// Test suite for the MobileEditorContext
describe('MobileEditorContext', () => {
	// Clear localStorage before each test
	beforeEach(() => {
		localStorageMock.clear();
	});

	// Test: Verify that initial elements are loaded from localStorage
	it('provides the initial elements from localStorage', () => {
		// Mock initial elements in localStorage
		const mockElements = [
			{ id: '1', type: 'text-editor', config: {} },
			{ id: '2', type: 'call-to-action', config: {} },
		];
		localStorageMock.setItem(
			'mobileEditorElements',
			JSON.stringify(mockElements)
		);

		// Render the test component with the provider
		render(
			<MobileEditorProvider>
				<TestComponent />
			</MobileEditorProvider>
		);

		// Verify that the elements from localStorage are rendered
		expect(screen.getByText('text-editor')).toBeInTheDocument();
		expect(screen.getByText('call-to-action')).toBeInTheDocument();
	});

	// Test: Verify that elements are saved to localStorage on update
	it('saves elements to localStorage when they are updated', () => {
		// Render the test component with the provider
		render(
			<MobileEditorProvider>
				<TestComponent />
			</MobileEditorProvider>
		);

		// Simulate adding a new element
		const button = screen.getByText('Add Text Editor');
		act(() => {
			button.click();
		});

		// Verify that the new element is rendered
		expect(screen.getByText('text-editor')).toBeInTheDocument();

		// Verify that the new element is saved in localStorage
		const storedElements = JSON.parse(
			localStorageMock.getItem('mobileEditorElements') || '[]'
		);
		expect(storedElements).toHaveLength(1);
		expect(storedElements[0].type).toBe('text-editor');
	});

	// Test: Verify that an error is thrown if `useMobileEditor` is used outside of its provider
	it('throws an error if useMobileEditor is used outside the provider', () => {
		// Define a component that uses the context outside of the provider
		const BadComponent: React.FC = () => {
			useMobileEditor();
			return null;
		};

		// Verify that rendering this component throws an error
		expect(() => render(<BadComponent />)).toThrowError(
			'useMobileEditor must be used within a MobileEditorProvider'
		);
	});

	// Test: Verify that a new element is added and the context state is updated
	it('adds a new element and updates the context state', () => {
		// Render the test component with the provider
		render(
			<MobileEditorProvider>
				<TestComponent />
			</MobileEditorProvider>
		);

		// Simulate adding a new element
		const button = screen.getByText('Add Text Editor');
		act(() => {
			button.click();
		});

		// Verify that the new element is added to the list
		expect(screen.getByText('text-editor')).toBeInTheDocument();
	});
});
