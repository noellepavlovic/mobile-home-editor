/**
 * Header Component
 * This component displays the top section (header) of the application.
 * It includes a title and a tagline.
 */

import React from 'react';

const Header: React.FC = () => {
	return (
		// Main header container with full width, background color, and shadow
		<div className='w-full bg-cyan-600 shadow' role='banner'>
			{/* Flex container for aligning title and tagline */}
			<div className='flex justify-between items-center p-4'>
				{/* Application title with styling for size, padding, and font weight */}
				<h3 className='text-white text-4xl pl-3 pr-6 font-semibold'>
					Elementalist
				</h3>
				{/* Tagline, hidden on small screens for responsive design */}
				<h1 className='text-white text-base font-normal mr-4 hidden sm:block'>
					Master the elements of a perfect home screen
				</h1>
			</div>
		</div>
	);
};

export default Header;
