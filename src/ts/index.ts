import {editor} from 'monaco-editor';
import {activateFormatting} from "./formatting";
import {setWordDefinitionFor} from "./vscode-monaco";

export class MonacoMarkdownExtension {
    activate(editor: editor.IStandaloneCodeEditor) {
        activateFormatting(editor)

        // Allow `*` in word pattern for quick styling
        setWordDefinitionFor('markdown',
            /(-?\d*\.\d\w*)|([^\!\@\#\%\^\&\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s\，\。\《\》\？\；\：\‘\“\’\”\（\）\【\】\、]+)/g
        );
    }
}
