# Monaco Markdown 

This is a port of [Markdown extension for VS Code](https://github.com/yzhang-gh/vscode-markdown)
 to [Monaco](https://microsoft.github.io/monaco-editor) web editor.
 
 The initial plugin is based on the VS Code API, while this one uses only Monaco editor API. The logic
 and the functionality is pretty much the same 
 (minus completion for local files paths and rendering, plus some bug-fixes)
 
 
### Run demo

To launch the demo web page, execute `gulp dist` (see package.json fro details)
and then open `demo\index.html`.


### Features

* Toggle bold/italic/strikethrough/math actions
* Headings up/down actions
* Toggle list
* Lists auto-numbering on enter
* List items indent/dedent on tab/shift-tab
* Suggestions for LaTeX, header references, and link labels
* Formatting for tables



### Usage

There is an npm package for the library: https://www.npmjs.com/package/monaco-markdown


