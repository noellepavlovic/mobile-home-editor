/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: 'jest-environment-jsdom',
	roots: ['<rootDir>/src'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { useESM: true }],
		'^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
	},
	globals: {
		'ts-jest': {
			tsconfig: './tsconfig.app.json', // Specify the correct tsconfig file
		},
	},
	moduleNameMapper: {
		'\\.(css|scss|sass|less)$': 'identity-obj-proxy', // Mock CSS
		'\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock assets
		'^swiper/react$': '<rootDir>/__mocks__/swiper/react.tsx',
		'^swiper/modules$': '<rootDir>/__mocks__/swiper/modules.tsx',
		'^swiper/swiper.min.css$': '<rootDir>/__mocks__/swiper/swiper.min.css.ts',
		'^swiper/modules/navigation/navigation.min.css$':
			'<rootDir>/__mocks__/swiper/modules/navigation/navigation.min.css.ts',
		'^swiper/modules/pagination/pagination.min.css$':
			'<rootDir>/__mocks__/swiper/modules/pagination/pagination.min.css.ts',
	},

	transformIgnorePatterns: [
		'/node_modules/(?!react-dnd|react-dnd-html5-backend|dnd-core|@react-dnd.*)/',
		'/node_modules/(?!swiper|ssr-window|dom7)/',
	],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Additional setup
	testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignore node_modules and dist
	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'], // Match test files
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Recognize file extensions
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/index.ts',
		'!src/main.tsx',
	],
	coverageDirectory: '<rootDir>/coverage',
};
