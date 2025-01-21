import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
	{ ignores: ['dist'] },
	{
		extends: [
			js.configs.recommended,
			'plugin:@typescript-eslint/recommended',
			'plugin:perfectionist/recommended-natural',
		],
		languageOptions: {
			ecmaVersion: 2020,
			parser: tsParser,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			'@typescript-eslint': ts,
			perfectionist,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{ allowConstantExport: true },
			],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/no-implicit-any-catch': 'off',
			'@typescript-eslint/no-parameter-properties': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-inferrable-types': [
				'error',
				{ ignoreParameters: true, ignoreProperties: true },
			],
			'no-multiple-empty-lines': ['error', { max: 2, maxBOF: 1, maxEOF: 0 }],
			'import/first': 'error',
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'off',
			'perfectionist/sort-imports': [
				'error',
				{
					type: 'natural',
					order: 'asc',
				},
			],
			semi: ['error', 'always'],
			'no-console': 'off',
		},
	},
];
