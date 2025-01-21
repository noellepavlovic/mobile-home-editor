import React from 'react';

export const Swiper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <div className='swiper-mock'>{children}</div>;
export const SwiperSlide: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <div className='swiper-slide-mock'>{children}</div>;
