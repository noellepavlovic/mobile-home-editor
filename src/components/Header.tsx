import React from 'react';

const Header: React.FC = () => {
	return (
		<div className='w-full bg-cyan-600 shadow'>
			<div className='flex justify-between items-center p-4'>
				<h3 className='text-white text-4xl pl-3 pr-6 font-semibold'>
					Elementalist
				</h3>
				<h1 className='text-white text-base font-normal mr-4 hidden sm:block'>
					Master the elements of a perfect home screen
				</h1>
			</div>
		</div>
	);
};

export default Header;
