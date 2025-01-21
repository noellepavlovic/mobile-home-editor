// Import Jest DOM extensions to enable additional matchers like `toBeInTheDocument`
import '@testing-library/jest-dom';
// Import functions for rendering, querying, and testing DOM elements
import { render, screen } from '@testing-library/react';

// Import the Header component to test
import Header from '../components/Header';

describe('Header Component', () => {
	// Test for rendering the header text
	it('renders the header text', () => {
		// Render the Header component
		render(<Header />);

		// Verify that the title is rendered
		const titleElement = screen.getByText(/Elementalist/i);
		expect(titleElement).toBeInTheDocument();

		// Verify that the subtitle is rendered for larger screens
		const subtitleElement = screen.getByText(
			/Master the elements of a perfect home screen/i
		);
		expect(subtitleElement).toBeInTheDocument();
	});

	// Test for verifying the styles applied to the Header component
	it('has the correct styles applied', () => {
		// Render the Header component
		render(<Header />);

		// Check the background color class on the header element
		const headerElement = screen.getByRole('banner');
		expect(headerElement).toHaveClass('bg-cyan-600');

		// Check if the title has the correct text size class
		const titleElement = screen.getByText(/Elementalist/i);
		expect(titleElement).toHaveClass('text-4xl');
	});
});
