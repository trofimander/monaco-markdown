import {editor} from 'monaco-editor';
import {activateFormatting} from "./formatting";
import {setWordDefinitionFor, TextEditor} from "./vscode-monaco";
import {activateListEditing} from "./listEditing";
import {activateTableFormatter} from "./tableFormatter";
import {activateMarkdownMath} from "./markdown.contribution";

export class MonacoMarkdownExtension {
    activate(editor: editor.IStandaloneCodeEditor) {
        if (editor.getModel()?.getModeId() === "markdown") {
            let textEditor = new TextEditor(editor)

            activateFormatting(textEditor)
            activateListEditing(textEditor)
            activateTableFormatter(textEditor)

            // Allow `*` in word pattern for quick styling
            setWordDefinitionFor(textEditor.languageId,
                /(-?\d*\.\d\w*)|([^\!\@\#\%\^\&\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s\，\。\《\》\？\；\：\‘\“\’\”\（\）\【\】\、]+)/g
            );
        }
    }
}

activateMarkdownMath()
