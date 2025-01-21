// Import the `validateURL` helper function
import { validateURL } from '../helpers/validateURL';

// Test suite for the `validateURL` function
describe('validateURL', () => {
	//  Appends "http://" to a URL if no scheme is present
	it('should return a valid URL with "http://" prepended if no scheme is present', async () => {
		// Parameters simulating a missing scheme in the URL
		const params = {
			args: { value: 'example.com', siblingData: { type: 'website' } },
		};

		// Execute the function and verify the result
		const result = await validateURL(params);
		expect(result).toBe('http://example.com');
	});

	//  Returns the URL unchanged if it already has "http://" or "https://"
	it('should return the URL unchanged if it already has "http://" or "https://"', async () => {
		// Parameters simulating URLs with "http://" and "https://"
		const paramsHttp = {
			args: { value: 'http://example.com', siblingData: { type: 'website' } },
		};
		const paramsHttps = {
			args: { value: 'https://example.com', siblingData: { type: 'website' } },
		};

		// Execute the function for both cases
		const resultHttp = await validateURL(paramsHttp);
		const resultHttps = await validateURL(paramsHttps);

		// Verify the results are unchanged
		expect(resultHttp).toBe('http://example.com');
		expect(resultHttps).toBe('https://example.com');
	});

	//  Throws an error if the value is not a valid URL
	it('should throw an error if the value is not a valid URL', async () => {
		// Parameters simulating an invalid URL
		const params = {
			args: { value: 'invalid-url', siblingData: { type: 'website' } },
		};

		// Execute the function and verify that it throws an error
		await expect(validateURL(params)).rejects.toThrow(
			'URL validation failed: value is not a valid URL'
		);
	});

	//  Throws an error if the value is not a string
	it('should throw an error if the value is not a string', async () => {
		// Parameters simulating a non-string value
		const params = {
			args: { value: 12345, siblingData: { type: 'website' } },
		};

		// Execute the function and verify that it throws an error
		await expect(validateURL(params)).rejects.toThrow(
			'URL validation failed: value is not a string.'
		);
	});

	//  Returns the original value if the `siblingData` type is not "website"
	it('should return the original value if the siblingData type is not "website"', async () => {
		// Parameters simulating a non-website type in `siblingData`
		const params = {
			args: { value: 'example.com', siblingData: { type: 'other' } },
		};

		// Execute the function and verify the result
		const result = await validateURL(params);
		expect(result).toBe('example.com');
	});
});
