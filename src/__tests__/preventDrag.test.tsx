// Import the `preventDrag` utility function for testing
import { preventDrag } from '../helpers/preventDrag';

// Test suite for the `preventDrag` helper function
describe('preventDrag', () => {
	// Test: Verify that the `preventDrag` function prevents the default drag behavior and stops event propagation
	it('should prevent default drag behavior and stop propagation', () => {
		// Mock a drag event with `stopPropagation` and `preventDefault` methods
		const mockEvent = {
			stopPropagation: jest.fn(), // Mock function to simulate stopping event propagation
			preventDefault: jest.fn(), // Mock function to simulate preventing the default action
		} as unknown as React.DragEvent;

		// Call the `preventDrag` function with the mock event
		preventDrag(mockEvent);

		// Verify that `stopPropagation` was called
		expect(mockEvent.stopPropagation).toHaveBeenCalled();

		// Verify that `preventDefault` was called
		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});
});
