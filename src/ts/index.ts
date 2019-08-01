import {editor,} from 'monaco-editor';
import {activateFormatting} from "./formatting";

export class MonacoMarkdownExtension {
    activate(editor: editor.IStandaloneCodeEditor) {
        activateFormatting(editor)
    }
}
