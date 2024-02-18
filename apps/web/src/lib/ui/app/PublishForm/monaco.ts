import * as monaco from 'monaco-editor';

import markdownWorker from 'monaco-editor/esm/vs/basic-languages/markdown/markdown?worker';
// import ayaya from "monaco-editor/esm/vs/language/"

self.MonacoEnvironment = {
	getWorker: function (_: string, label: string) {
		switch (label) {
			default:
				return new markdownWorker();
		}
	}
};

export default monaco;
