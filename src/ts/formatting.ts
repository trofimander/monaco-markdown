'use strict';

import {editor, KeyCode, KeyMod} from 'monaco-editor';

import { fixMarker } from './listEditing';
import {TextDocument, TextEditor} from "./vscode-monaco";
import {Position, Selection, Range, WorkspaceEdit} from "./extHostTypes";

export function addKeybinding(editor: TextEditor, name: String, fun: CallableFunction, keybindings: number[], label?: string, context?: string, contextMenuGroupId = "markdown.extension.editing") {
    editor.addAction({
        contextMenuGroupId: contextMenuGroupId,
        contextMenuOrder: 0,
        id: "markdown.extension.editing." + name,
        keybindingContext: context,
        keybindings: keybindings,
        label: label,
        precondition: "",
        run(_: editor.ICodeEditor): void | Promise<void> {
            fun(editor)
            return undefined;
        }
    });
}

export function activateFormatting(editor: TextEditor) {
    addKeybinding(editor, "toggleBold", toggleBold, [KeyMod.CtrlCmd | KeyCode.KEY_B], "Toggle bold");
    addKeybinding(editor, "toggleItalic", toggleItalic, [KeyMod.CtrlCmd | KeyCode.KEY_I], "Toggle italic");
    addKeybinding(editor, "toggleCodeSpan", toggleCodeSpan, [KeyMod.CtrlCmd | KeyCode.US_BACKTICK], "Toggle code span");
    addKeybinding(editor, "toggleList", toggleList, [KeyMod.CtrlCmd | KeyCode.KEY_L], "Toggle list");
}

/**
 * Here we store Regexp to check if the text is the single link.
 */
const singleLinkRegex: RegExp = createLinkRegex();

// Return Promise because need to chain operations in unit tests

function toggleBold(editor: TextEditor) {
    return styleByWrapping(editor, '**');
}

function toggleItalic(editor: TextEditor) {
    // let indicator = workspace.getConfiguration('markdown.extension.italic').get<string>('indicator');
    return styleByWrapping(editor, '*');
}

function toggleCodeSpan(editor: TextEditor) {
    return styleByWrapping(editor, '`');
}

function toggleList(editor: TextEditor) {
    const doc = editor.document;
    let batchEdit = new WorkspaceEdit();

    editor.selections.forEach(selection => {
        if (selection.isEmpty) {
            toggleListSingleLine(doc, selection.active.line, batchEdit);
        } else {
            for (let i = selection.start.line; i <= selection.end.line; i++) {
                toggleListSingleLine(doc, i, batchEdit);
            }
        }
    });

    return editor.applyEdit(batchEdit, [])
        .then(() => fixMarker(editor));
}

function toggleListSingleLine(doc: TextDocument, line: number, wsEdit: WorkspaceEdit) {
    const lineText = doc.lineAt(line).text;
    const indentation = lineText.trim().length === 0 ? lineText.length : lineText.indexOf(lineText.trim());
    const lineTextContent = lineText.substr(indentation);

    if (lineTextContent.startsWith("- ")) {
        wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "* ");
    } else if (lineTextContent.startsWith("* ")) {
        wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "+ ");
    } else if (lineTextContent.startsWith("+ ")) {
        wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "1. ");
    } else if (/^\d\. /.test(lineTextContent)) {
        wsEdit.replace(doc.uri, new Range(line, indentation + 1, line, indentation + 2), ")");
    } else if (/^\d\) /.test(lineTextContent)) {
        wsEdit.delete(doc.uri, new Range(line, indentation, line, indentation + 3));
    } else {
        wsEdit.insert(doc.uri, new Position(line, indentation), "- ");
    }
}

// async function paste() {
//     const editor = window.activeTextEditor;
//     const selection = editor.selection;
//     if (selection.isSingleLine && !isSingleLink(editor.document.getText(selection))) {
//         const text = await env.clipboard.readText();
//         if (isSingleLink(text)) {
//             return commands.executeCommand("editor.action.insertSnippet", { "snippet": `[$TM_SELECTED_TEXT$0](${text})` });
//         }
//     }
//     return commands.executeCommand("editor.action.clipboardPasteAction");
// }

/**
 * Creates Regexp to check if the text is a link (further detailes in the isSingleLink() documentation).
 *
 * @return Regexp
 */
function createLinkRegex(): RegExp {
    // unicode letters range(must not be a raw string)
    const ul = '\\u00a1-\\uffff';
    // IP patterns
    const ipv4_re = '(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}';
    const ipv6_re = '\\[[0-9a-f:\\.]+\\]';  // simple regex (in django it is validated additionally)


    // Host patterns
    const hostname_re = '[a-z' + ul + '0-9](?:[a-z' + ul + '0-9-]{0,61}[a-z' + ul + '0-9])?';
    // Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
    const domain_re = '(?:\\.(?!-)[a-z' + ul + '0-9-]{1,63})*';

    const tld_re = ''
        + '\\.'                               // dot
        + '(?!-)'                             // can't start with a dash
        + '(?:[a-z' + ul + '-]{2,63}'         // domain label
        + '|xn--[a-z0-9]{1,59})'              // or punycode label
        // + '(?<!-)'                            // can't end with a dash
        + '\\.?'                              // may have a trailing dot
    ;

    const host_re = '(' + hostname_re + domain_re + tld_re + '|localhost)';
    const pattern = ''
        + '^(?:[a-z0-9\\.\\-\\+]*)://'  // scheme is not validated (in django it is validated additionally)
        + '(?:[^\\s:@/]+(?::[^\\s:@/]*)?@)?'  // user: pass authentication
        + '(?:' + ipv4_re + '|' + ipv6_re + '|' + host_re + ')'
        + '(?::\\d{2,5})?'  // port
        + '(?:[/?#][^\\s]*)?'  // resource path
        + '$' // end of string
    ;

    return new RegExp(pattern, 'i');
}

/**
 * Checks if the string is a link. The list of link examples you can see in the tests file
 * `test/linksRecognition.test.ts`. This code ported from django's
 * [URLValidator](https://github.com/django/django/blob/2.2b1/django/core/validators.py#L74) with some simplifyings.
 *
 * @param text string to check
 *
 * @return boolean
 */
export function isSingleLink(text: string): boolean {
    return singleLinkRegex.test(text);
}

function styleByWrapping(editor: TextEditor, startPattern: string, endPattern?: string) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }

    let selections = editor.selections;

    let batchEdit = new WorkspaceEdit();
    let shifts: [Position, number][] = [];
    let newSelections: Selection[] = selections.slice();

    selections.forEach((selection, i) => {
        let cursorPos = selection.active;
        const shift = shifts.map(([pos, s]) => (selection.start.line == pos.line && selection.start.character >= pos.character) ? s : 0)
            .reduce((a, b) => a + b, 0);

        if (selection.isEmpty) {
            // No selected text
            if (startPattern !== '~~' && getContext(editor, cursorPos, startPattern) === `${startPattern}text|${endPattern}`) {
                // `**text|**` to `**text**|`
                let newCursorPos = cursorPos.with({character: cursorPos.character + shift + endPattern.length});
                newSelections[i] = new Selection(newCursorPos, newCursorPos);
                return;
            } else if (getContext(editor, cursorPos, startPattern) === `${startPattern}|${endPattern}`) {
                // `**|**` to `|`
                let start = cursorPos.with({character: cursorPos.character - startPattern.length});
                let end = cursorPos.with({character: cursorPos.character + endPattern.length});
                wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, new Range(start, end), false, startPattern);
            } else {
                // Select word under cursor
                let wordRange = editor.document.getWordRangeAtPosition(cursorPos);
                if (wordRange == undefined) {
                    wordRange = selection;
                }
                // One special case: toggle strikethrough in task list
                const currentTextLine = editor.document.lineAt(cursorPos.line);
                if (startPattern === '~~' && /^\s*[\*\+\-] (\[[ x]\] )? */g.test(currentTextLine.text)) {
                    wordRange = currentTextLine.range.with(new Position(cursorPos.line, currentTextLine.text.match(/^\s*[\*\+\-] (\[[ x]\] )? */g)[0].length));
                }
                wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, wordRange, false, startPattern);
            }
        } else {
            // Text selected
            wrapRange(editor, batchEdit, shifts, newSelections, i, shift, cursorPos, selection, true, startPattern);
        }
    });

    const hasSelection = editor.selection && !editor.selection.isEmpty;

    return editor.applyEdit(batchEdit, newSelections).then(() => {
        if (!hasSelection) {
            editor.selections = newSelections;
        }
    });
}

/**
 * Add or remove `startPattern`/`endPattern` according to the context
 * @param editor
 * @param options The undo/redo behavior
 * @param cursor cursor position
 * @param range range to be replaced
 * @param isSelected is this range selected
 * @param startPtn
 * @param endPtn
 */
function wrapRange(editor: TextEditor, wsEdit: WorkspaceEdit, shifts: [Position, number][], newSelections: Selection[], i: number, shift: number, cursor: Position, range: Range, isSelected: boolean, startPtn: string, endPtn?: string) {
    if (endPtn == undefined) {
        endPtn = startPtn;
    }

    let text = editor.document.getText(range);
    const prevSelection = newSelections[i];
    const ptnLength = (startPtn + endPtn).length;

    let newCursorPos = cursor.with({character: cursor.character + shift});
    let newSelection: Selection;
    if (isWrapped(text, startPtn)) {
        // remove start/end patterns from range
        wsEdit.replace(editor.document.uri, range, text.substr(startPtn.length, text.length - ptnLength));

        shifts.push([range.end, -ptnLength]);

        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.character == range.end.character) {
                    newCursorPos = cursor.with({character: cursor.character + shift - ptnLength});
                } else {
                    newCursorPos = cursor.with({character: cursor.character + shift - startPtn.length});
                }
            } else { // means `**|**` -> `|`
                newCursorPos = cursor.with({character: cursor.character + shift + startPtn.length});
            }
            newSelection = new Selection(newCursorPos, newCursorPos);
        } else {
            newSelection = new Selection(
                prevSelection.start.with({character: prevSelection.start.character + shift}),
                prevSelection.end.with({character: prevSelection.end.character + shift - ptnLength})
            );
        }
    } else {
        // add start/end patterns around range
        wsEdit.replace(editor.document.uri, range, startPtn + text + endPtn);

        shifts.push([range.end, ptnLength]);

        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.character == range.end.character) {
                    newCursorPos = cursor.with({character: cursor.character + shift + ptnLength});
                } else {
                    newCursorPos = cursor.with({character: cursor.character + shift + startPtn.length});
                }
            } else { // means `|` -> `**|**`
                newCursorPos = cursor.with({character: cursor.character + shift + startPtn.length});
            }
            newSelection = new Selection(newCursorPos, newCursorPos);
        } else {
            newSelection = new Selection(
                prevSelection.start.with({character: prevSelection.start.character + shift}),
                prevSelection.end.with({character: prevSelection.end.character + shift + ptnLength})
            );
        }
    }

    newSelections[i] = newSelection;
}

function isWrapped(text: string, startPattern: string, endPattern?: string): boolean {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    return text.startsWith(startPattern) && text.endsWith(endPattern);
}

function getContext(editor: TextEditor, cursorPos: Position, startPattern: string, endPattern?: string): string {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }

    let startPositionCharacter = cursorPos.character - startPattern.length;
    let endPositionCharacter = cursorPos.character + endPattern.length;

    if (startPositionCharacter < 0) {
        startPositionCharacter = 0;
    }

    let leftText = editor.document.getText(new Range(cursorPos.line, startPositionCharacter, cursorPos.line, cursorPos.character));
    let rightText = editor.document.getText(new Range(cursorPos.line, cursorPos.character, cursorPos.line, endPositionCharacter));

    if (rightText == endPattern) {
        if (leftText == startPattern) {
            return `${startPattern}|${endPattern}`;
        } else {
            return `${startPattern}text|${endPattern}`;
        }
    }
    return '|';
}
