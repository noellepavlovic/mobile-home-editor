import React from 'react';

export const Navigation: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <div className='navigation-mock'>{children}</div>;

export const Pagination: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <div className='pagination-mock'>{children}</div>;
