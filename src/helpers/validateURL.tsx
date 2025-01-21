/**
 * validateURL Utility Function
 * Validates and normalizes a URL based on the provided parameters.
 * Ensures that the URL is valid and, if necessary, prepends `http://` for incomplete URLs.
 */

export async function validateURL(params: { args: any }): Promise<string> {
	if (params.args.siblingData.type === 'website') {
		// Regular expression to validate URLs
		const urlRegex =
			/^(https?:\/\/)?((([\w-]+(\.[\w-]+)*)\.)+[\w-]{2,}|(([\w-]{1,3}\.){3}[\w-]{1,3}))(:[\w-]+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;

		// Trim and validate the URL value
		const url =
			typeof params.args.value === 'string'
				? params.args.value.trim()
				: (() => {
						throw new Error('URL validation failed: value is not a string.');
				  })();

		// Check if the URL matches the regex
		if (urlRegex.test(url)) {
			// Determine if the URL needs "http://" or "https://"
			const shouldPrepend =
				!url.startsWith('http://') && !url.startsWith('https://');
			return shouldPrepend ? `http://${url}` : url;
		} else {
			// Throw an error if the URL is invalid
			throw new Error('URL validation failed: value is not a valid URL');
		}
	} else {
		// If the type is not 'website', return the value as is
		return params.args.value;
	}
}
