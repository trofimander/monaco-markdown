/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { registerLanguage } from './contribution';

export function activateMarkdownMath() {
	registerLanguage({
		id: 'markdown-math',
		extensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mdtxt', '.mdtext'],
		aliases: ['Markdown', 'markdown'],
		loader: () => import('./markdown')
	});

	console.log("monaco-math language registered")
}
