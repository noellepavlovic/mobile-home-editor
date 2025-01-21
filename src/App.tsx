// Importing global CSS for the application
import './App.css';

// Importing React and necessary hooks for managing state and lifecycle
import React, { useState, useEffect } from 'react';

// Importing `react-dnd` for drag-and-drop functionality with an HTML5 backend
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Importing a hook for responsive design queries
import { useMediaQuery } from 'react-responsive';

// Importing the MobileEditor context and provider for managing state across components
import {
	MobileEditorProvider,
	useMobileEditor,
} from './contexts/MobileEditorContext';

// Importing individual components used within the application
import Header from './components/Header';
import LeftNav from './components/LeftNav';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

// Main App component that serves as the entry point for the application
const App: React.FC = () => {
	// Detects if the screen size is mobile (less than 767px)
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	// State to manage the visibility of the side menu
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Toggles the menu's open/close state
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	// Effect to handle clicks outside the menu to close it
	useEffect(() => {
		// Closes the menu if the user clicks outside it
		const handleClickOutside = (event: MouseEvent) => {
			const menu = document.querySelector('.left-nav-menu');
			if (menu && !menu.contains(event.target as Node) && isMenuOpen) {
				setIsMenuOpen(false);
			}
		};

		// Add event listener for clicks
		document.addEventListener('click', handleClickOutside);
		return () => {
			// Clean up event listener on component unmount
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isMenuOpen]);

	return (
		// Providing drag-and-drop and editor state across the application
		<DndProvider backend={HTML5Backend}>
			<MobileEditorProvider>
				{/* Renders the main content of the app */}
				<AppContent
					isMobile={isMobile}
					isMenuOpen={isMenuOpen}
					toggleMenu={toggleMenu}
				/>
			</MobileEditorProvider>
		</DndProvider>
	);
};

// AppContent component handles the layout and rendering of main components
const AppContent: React.FC<{
	isMobile: boolean; // Flag indicating if the device is mobile
	isMenuOpen: boolean; // Current state of the menu (open/closed)
	toggleMenu: () => void; // Function to toggle the menu state
}> = ({ isMobile, isMenuOpen, toggleMenu }) => {
	// Accessing elements from the MobileEditor context
	const { elements } = useMobileEditor();

	return (
		<>
			{/* Fixed Header component at the top of the screen */}
			<div className='w-screen fixed top-0 left-0 z-1000'>
				<Header />
			</div>

			{/* Main container for the application layout */}
			<div className='app-container fixed top-0 flex min-h-screen w-screen'>
				{/* Hamburger menu button for mobile view */}
				<button
					className='left-nav-icon md:hidden sticky top-[72px] p-3 bg-gray-800 rounded-none text-white focus:outline-none'
					onClick={(e) => {
						e.stopPropagation(); // Prevents event from propagating to parent elements
						toggleMenu(); // Toggles the side menu
					}}
				>
					{/* Three lines representing the hamburger icon */}
					<div className='space-y-1'>
						<div className='w-6 h-0.5 bg-white'></div>
						<div className='w-6 h-0.5 bg-white'></div>
						<div className='w-6 h-0.5 bg-white'></div>
					</div>
				</button>

				{/* Conditional rendering of the side menu based on the device type */}
				{isMobile ? (
					// Mobile: LeftNav component handles the slide-out menu
					<LeftNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
				) : (
					// Desktop: LeftPanel is always visible
					<div className='hidden md:block w-1/4 max-w-[300px] bg-zinc-50 p-4 border-r mt-[72px] min-h-screen'>
						<LeftPanel />
					</div>
				)}

				{/* Main content area for draggable and editable elements */}
				<div
					id='right-panel'
					className='flex-1 bg-zinc-200 top-0 mt-[72px] h-dvh overflow-y-auto'
				>
					<RightPanel elements={elements} />
				</div>
			</div>
		</>
	);
};

export default App;
