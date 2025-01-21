/**
 * preventDrag Utility Function
 * Prevents drag-and-drop events from propagating and executing their default behavior.
 * Useful for disabling unintended drag actions on elements.
 *
 * @param {React.DragEvent} event - The drag event to handle.
 */
import React from 'react';

export function preventDrag(event: React.DragEvent) {
	// Stop the event from propagating to parent elements
	event.stopPropagation();
	// Prevent the default drag-and-drop behavior
	event.preventDefault();
}
