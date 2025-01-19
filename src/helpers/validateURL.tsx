export async function validateURL(params: { args: any }): Promise<string> {
	if (params.args.siblingData.type === 'website') {
		const urlRegex =
			/^(https?:\/\/)?((([\w-]+(\.[\w-]+)*)\.)+[\w-]{2,}|(([\w-]{1,3}\.){3}[\w-]{1,3}))(:[\w-]+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;

		const url =
			typeof params.args.value === 'string'
				? params.args.value.trim()
				: (() => {
						throw new Error('URL validation failed: value is not a string.');
				  })();

		if (urlRegex.test(url)) {
			// Check if it starts with http:// or https://. If not, prepend http://
			const shouldPrepend =
				!url.startsWith('http://') && !url.startsWith('https://');
			return shouldPrepend ? `http://${url}` : url;
		} else {
			// If not a valid URL, throw an error
			throw new Error('URL validation failed: value is not a valid URL');
		}
	} else {
		return params.args.value;
	}
}
