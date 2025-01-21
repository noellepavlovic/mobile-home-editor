import '@testing-library/jest-dom';

jest.mock('swiper/swiper.min.css', () => {});
jest.mock('swiper/modules/navigation/navigation.min.css', () => {});
jest.mock('swiper/modules/pagination/pagination.min.css', () => {});

global.matchMedia =
	global.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: jest.fn(),
			removeListener: jest.fn(),
		};
	};
