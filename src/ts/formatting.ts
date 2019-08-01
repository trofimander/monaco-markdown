'use strict';

import {editor, KeyCode, KeyMod, Position, Range, Selection,} from 'monaco-editor';

export function activateFormatting(editor: editor.IStandaloneCodeEditor) {
    console.log("Activating markdown formatting extension")
    console.log(editor)
    editor.addAction({
        contextMenuGroupId: "markdown.extension.editing",
        contextMenuOrder: 0,
        id: "markdown.extension.editing.toggleBold",
        keybindingContext: "",
        keybindings: [KeyMod.CtrlCmd | KeyCode.KEY_B],
        label: "Toggle bold",
        precondition: "",
        run(editor: editor.ICodeEditor): void | Promise<void> {
            toggleBold(editor)
            return undefined;
        }
    });
    // context.subscriptions.push(
    //     commands.registerCommand('', toggleBold),
    //     commands.registerCommand('markdown.extension.editing.toggleItalic', toggleItalic),
    //     commands.registerCommand('markdown.extension.editing.toggleCodeSpan', toggleCodeSpan),
    //     commands.registerCommand('markdown.extension.editing.toggleStrikethrough', toggleStrikethrough),
    //     commands.registerCommand('markdown.extension.editing.toggleMath', () => toggleMath(transTable)),
    //     commands.registerCommand('markdown.extension.editing.toggleMathReverse', () => toggleMath(reverseTransTable)),
    //     commands.registerCommand('markdown.extension.editing.toggleHeadingUp', toggleHeadingUp),
    //     commands.registerCommand('markdown.extension.editing.toggleHeadingDown', toggleHeadingDown),
    //     commands.registerCommand('markdown.extension.editing.toggleList', toggleList),
    //     commands.registerCommand('markdown.extension.editing.paste', paste)
    // );
}

/**
 * Here we store Regexp to check if the text is the single link.
 */
// const singleLinkRegex: RegExp = createLinkRegex();

// Return Promise because need to chain operations in unit tests

function toggleBold(editor: editor.ICodeEditor) {
    return styleByWrapping(editor, '**');
}

// function toggleItalic(editor: editor.ICodeEditor) {
//     return styleByWrapping(editor, '*');
// }
//
// function toggleCodeSpan(editor: editor.ICodeEditor) {
//     return styleByWrapping(editor, '`');
// }
//
// function toggleStrikethrough(editor: editor.ICodeEditor) {
//     return styleByWrapping(editor, '~~');
// }
//
// async function toggleHeadingUp(editor: editor.ICodeEditor) {
//     let selection = editor.getSelection();
//     let model = editor.getModel();
//     if (selection!= null && model != null ) {
//         let lineIndex = selection.positionLineNumber;
//
//         let lineText = model.getLineContent(lineIndex);
//
//         return await editor.edit((editBuilder) => {
//             if (!lineText.startsWith('#')) { // Not a heading
//                 editBuilder.insert(new Position(lineIndex, 0), '# ');
//             } else if (!lineText.startsWith('######')) { // Already a heading (but not level 6)
//                 editBuilder.insert(new Position(lineIndex, 0), '#');
//             }
//         });
//     }
// }
//
// function toggleHeadingDown(editor: editor.ICodeEditor) {
//     let lineIndex = editor.selection.active.line;
//     let lineText = editor.document.lineAt(lineIndex).text;
//
//     editor.edit((editBuilder) => {
//         if (lineText.startsWith('# ')) { // Heading level 1
//             editBuilder.delete(Range.fromPositions(new Position(lineIndex, 0), new Position(lineIndex, 2)));
//         } else if (lineText.startsWith('#')) { // Heading (but not level 1)
//             editBuilder.delete(Range.fromPositions(new Position(lineIndex, 0), new Position(lineIndex, 1)));
//         }
//     });
// }

// enum MathBlockState {
//     // State 1: not in any others states
//     NONE,
//     // State 2: $|$
//     INLINE,
//     // State 3: $$ | $$
//     SINGLE_DISPLAYED,
//     // State 4:
//     // $$
//     // |
//     // $$
//     MULTI_DISPLAYED
// }
//
// function getMathState(editor: editor.ICodeEditor, cursor: Position): MathBlockState {
//     if (getContext(editor, cursor, '$') === '$|$') {
//         return MathBlockState.INLINE;
//     } else {
//         let model = editor.getModel();
//         if (getContext(editor, cursor, '$$ ', ' $$') === '$$ | $$') {
//             return MathBlockState.SINGLE_DISPLAYED;
//         } else if (
//             //@ts-ignore
//             model != null &&
//             model.getLineContent(cursor.lineNumber) === ''
//             && cursor.lineNumber > 0
//             && model.getLineContent(cursor.lineNumber - 1) === '$$'
//             && cursor.lineNumber < model.getLineCount() - 1
//             && model.getLineContent(cursor.lineNumber + 1) === '$$'
//         ) {
//             return MathBlockState.MULTI_DISPLAYED
//         } else {
//             return MathBlockState.NONE;
//         }
//     }
// }

// /**
//  * Modify the document, change from `oldMathBlockState` to `newMathBlockState`.
//  * @param editor
//  * @param cursor
//  * @param oldMathBlockState
//  * @param newMathBlockState
//  */
// function setMathState(editor: IEditor, cursor: Position, oldMathBlockState: MathBlockState, newMathBlockState: MathBlockState) {
//     // Step 1: Delete old math block.
//     editor.edit(editBuilder => {
//         let rangeToBeDeleted: Range
//         switch (oldMathBlockState) {
//             case MathBlockState.NONE:
//                 rangeToBeDeleted = Range.fromPositions(cursor, cursor);
//                 break;
//             case MathBlockState.INLINE:
//                 rangeToBeDeleted = Range.fromPositions(new Position(cursor.lineNumber, cursor.column - 1), new Position(cursor.lineNumber, cursor.column + 1));
//                 break;
//             case MathBlockState.SINGLE_DISPLAYED:
//                 rangeToBeDeleted = Range.fromPositions(new Position(cursor.lineNumber, cursor.column - 3), new Position(cursor.lineNumber, cursor.column + 3));
//                 break;
//             case MathBlockState.MULTI_DISPLAYED:
//                 rangeToBeDeleted = Range.fromPositions(new Position(cursor.lineNumber - 1, 0), new Position(cursor.lineNumber + 1, 2));
//                 break;
//         }
//         editBuilder.delete(rangeToBeDeleted)
//     }).then(() => {
//         // Step 2: Insert new math block.
//         editor.edit(editBuilder => {
//             let newCursor = editor.selection.active;
//             let stringToBeInserted: string
//             switch (newMathBlockState) {
//                 case MathBlockState.NONE:
//                     stringToBeInserted = ''
//                     break;
//                 case MathBlockState.INLINE:
//                     stringToBeInserted = '$$'
//                     break;
//                 case MathBlockState.SINGLE_DISPLAYED:
//                     stringToBeInserted = '$$  $$'
//                     break;
//                 case MathBlockState.MULTI_DISPLAYED:
//                     stringToBeInserted = '$$\n\n$$'
//                     break;
//             }
//             editBuilder.insert(newCursor, stringToBeInserted);
//         }).then(() => {
//             // Step 3: Move cursor to the middle.
//             let newCursor = editor.selection.active;
//             let newPosition: Position;
//             switch (newMathBlockState) {
//                 case MathBlockState.NONE:
//                     newPosition = newCursor
//                     break;
//                 case MathBlockState.INLINE:
//                     newPosition = newCursor.with(newCursor.lineNumber, newCursor.column - 1)
//                     break;
//                 case MathBlockState.SINGLE_DISPLAYED:
//                     newPosition = newCursor.with(newCursor.lineNumber, newCursor.column - 3)
//                     break;
//                 case MathBlockState.MULTI_DISPLAYED:
//                     newPosition = newCursor.with(newCursor.lineNumber - 1, 0)
//                     break;
//             }
//             editor.selection = new Selection(newPosition, newPosition);
//         })
//     });
// }

// const transTable = [
//     MathBlockState.NONE,
//     MathBlockState.INLINE,
//     MathBlockState.MULTI_DISPLAYED,
//     MathBlockState.SINGLE_DISPLAYED
// ];
// const reverseTransTable = new Array(...transTable).reverse();
//
// function toggleMath(transTable) {
//     let editor = window.activeTextEditor;
//     if (!editor.selection.isEmpty) return;
//     let cursor = editor.selection.active;
//
//     let oldMathBlockState = getMathState(editor, cursor)
//     let currentStateIndex = transTable.indexOf(oldMathBlockState);
//     setMathState(editor, cursor, oldMathBlockState, transTable[(currentStateIndex + 1) % transTable.length])
// }
//
// function toggleList() {
//     const editor = window.activeTextEditor;
//     const doc = editor.document;
//
//     editor.selections.forEach(selection => {
//         if (selection.isEmpty) {
//             toggleListSingleLine(doc, selection.active.line, batchEdit);
//         } else {
//             for (let i = selection.start.line; i <= selection.end.line; i++) {
//                 toggleListSingleLine(doc, i, batchEdit);
//             }
//         }
//     });
//
//     return workspace.applyEdit(batchEdit).then(() => fixMarker());
// }
//
// function toggleListSingleLine(doc: TextDocument, line: number, wsEdit: WorkspaceEdit) {
//     const lineText = doc.lineAt(line).text;
//     const indentation = lineText.trim().length === 0 ? lineText.length : lineText.indexOf(lineText.trim());
//     const lineTextContent = lineText.substr(indentation);
//
//     if (lineTextContent.startsWith("- ")) {
//         wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "* ");
//     } else if (lineTextContent.startsWith("* ")) {
//         wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "+ ");
//     } else if (lineTextContent.startsWith("+ ")) {
//         wsEdit.replace(doc.uri, new Range(line, indentation, line, indentation + 2), "1. ");
//     } else if (/^\d\. /.test(lineTextContent)) {
//         wsEdit.replace(doc.uri, new Range(line, indentation + 1, line, indentation + 2), ")");
//     } else if (/^\d\) /.test(lineTextContent)) {
//         wsEdit.delete(doc.uri, new Range(line, indentation, line, indentation + 3));
//     } else {
//         wsEdit.insert(doc.uri, new Position(line, indentation), "- ");
//     }
// }
//
// async function paste() {
//     const editor = window.activeTextEditor;
//     const selection = editor.selection;
//     if (selection.isSingleLine && !isSingleLink(editor.document.getText(selection))) {
//         const text = await env.clipboard.readText();
//         if (isSingleLink(text)) {
//             return commands.executeCommand("editor.action.insertSnippet", {"snippet": `[$TM_SELECTED_TEXT$0](${text})`});
//         }
//     }
//     return commands.executeCommand("editor.action.clipboardPasteAction");
// }

/**
 * Creates Regexp to check if the text is a link (further detailes in the isSingleLink() documentation).
 *
 * @return Regexp
 */
// function createLinkRegex(): RegExp {
//     // unicode letters range(must not be a raw string)
//     const ul = '\\u00a1-\\uffff';
//     // IP patterns
//     const ipv4_re = '(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|[0-1]?\\d?\\d)){3}';
//     const ipv6_re = '\\[[0-9a-f:\\.]+\\]';  // simple regex (in django it is validated additionally)
//
//
//     // Host patterns
//     const hostname_re = '[a-z' + ul + '0-9](?:[a-z' + ul + '0-9-]{0,61}[a-z' + ul + '0-9])?';
//     // Max length for domain name labels is 63 characters per RFC 1034 sec. 3.1
//     const domain_re = '(?:\\.(?!-)[a-z' + ul + '0-9-]{1,63}(?<!-))*';
//
//     const tld_re = ''
//         + '\\.'                               // dot
//         + '(?!-)'                             // can't start with a dash
//         + '(?:[a-z' + ul + '-]{2,63}'         // domain label
//         + '|xn--[a-z0-9]{1,59})'              // or punycode label
//         + '(?<!-)'                            // can't end with a dash
//         + '\\.?'                              // may have a trailing dot
//     ;
//
//     const host_re = '(' + hostname_re + domain_re + tld_re + '|localhost)';
//     const pattern = ''
//         + '^(?:[a-z0-9\\.\\-\\+]*)://'  // scheme is not validated (in django it is validated additionally)
//         + '(?:[^\\s:@/]+(?::[^\\s:@/]*)?@)?'  // user: pass authentication
//         + '(?:' + ipv4_re + '|' + ipv6_re + '|' + host_re + ')'
//         + '(?::\\d{2,5})?'  // port
//         + '(?:[/?#][^\\s]*)?'  // resource path
//         + '$' // end of string
//     ;
//
//     return new RegExp(pattern, 'i');
// }

/**
 * Checks if the string is a link. The list of link examples you can see in the tests file
 * `test/linksRecognition.test.ts`. This code ported from django's
 * [URLValidator](https://github.com/django/django/blob/2.2b1/django/core/validators.py#L74) with some simplifyings.
 *
 * @param text string to check
 *
 * @return boolean
 */
// export function isSingleLink(text: string): boolean {
//     return singleLinkRegex.test(text);
// }

function styleByWrapping(editor: editor.ICodeEditor, startPattern: string, endPattern?: string) {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    let selections = editor.getSelections();
    let model = editor.getModel();


    if (selections != null && model != null) {
        let edits: editor.IIdentifiedSingleEditOperation[] = [];
        let shifts: [Position, number][] = [];
        let newSelections: Selection[] = selections.slice();

        selections.forEach((selection: Selection, i: number) => {
            if (model != null) {

                let cursorPos = selection.getPosition();
                const shift = shifts.map(([pos, s]) => (selection.getStartPosition().lineNumber == pos.lineNumber && selection.getStartPosition().column >= pos.column) ? s : 0)
                    .reduce((a, b) => a + b, 0);

                if (selection.isEmpty) {
                    // No selected text
                    if (startPattern !== '~~' && getContext(editor, cursorPos, startPattern) === `${startPattern}text|${endPattern}`) {
                        // `**text|**` to `**text**|`
                        // @ts-ignore
                        let newCursorPos = cursorPos.with(undefined, cursorPos.column + shift + endPattern.length);
                        newSelections[i] = Selection.fromPositions(newCursorPos, newCursorPos);
                        return;
                    } else if (getContext(editor, cursorPos, startPattern) === `${startPattern}|${endPattern}`) {
                        // `**|**` to `|`
                        let start = cursorPos.with(undefined, cursorPos.column - startPattern.length);
                        // @ts-ignore
                        let end = cursorPos.with(undefined, cursorPos.column + endPattern.length);
                        wrapRange(editor, shifts, newSelections, i, shift, cursorPos, Range.fromPositions(start, end), false, startPattern);
                    } else {
                        let l = cursorPos.lineNumber;
                        // Select word under cursor
                        let word = model.getWordAtPosition(cursorPos);

                        let wordRange = word == undefined ?
                            selection :
                            new Range(l, word.startColumn, l, word.endColumn)

                        // One special case: toggle strikethrough in task list

                        const currentText = model.getLineContent(l);
                        const currentTextRange = new Range(l, model.getLineMinColumn(l), l, model.getLineMaxColumn(l));
                        let regExp = /^\s*[\*\+\-] (\[[ x]\] )? */g;

                        if (startPattern === '~~' && regExp.test(currentText)) {
                            // @ts-ignore
                            wordRange = currentTextRange.setStartPosition(l, currentText.match(regExp)[0].length);
                        }
                        edits = edits.concat(wrapRange(editor, shifts, newSelections, i, shift, cursorPos, wordRange, false, startPattern));
                    }
                } else {
                    // Text selected
                    wrapRange(editor, shifts, newSelections, i, shift, cursorPos, selection, true, startPattern);
                }
            }
        });


        return model.pushEditOperations(selections, edits,
            (): Selection[] => {
                return newSelections;
            })
    }

    return []
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
function wrapRange(editor: editor.ICodeEditor, shifts: [Position, number][], newSelections: Selection[], i: number, shift: number,
                   cursor: Position, range: Range, isSelected: boolean, startPtn: string, endPtn?: string): editor.IIdentifiedSingleEditOperation[] {
    if (endPtn == undefined) {
        endPtn = startPtn;
    }

    let edits: editor.IIdentifiedSingleEditOperation[] = []

    let model = editor.getModel();
    if (!model) {
        return edits;
    }

    let text = model.getValueInRange(range);
    const prevSelection = newSelections[i];
    const ptnLength = (startPtn + endPtn).length;

    let newCursorPos = cursor.with(undefined, cursor.column + shift);
    let newSelection: Selection;
    if (isWrapped(text, startPtn)) {
        // remove start/end patterns from range
        edits.push({range: range, text: text.substr(startPtn.length, text.length - ptnLength)})

        shifts.push([range.getEndPosition(), -ptnLength]);

        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.column == range.getEndPosition().column) {
                    newCursorPos = cursor.with(undefined, cursor.column + shift - ptnLength);
                } else {
                    newCursorPos = cursor.with(undefined, cursor.column + shift - startPtn.length);
                }
            } else { // means `**|**` -> `|`
                newCursorPos = cursor.with(undefined, cursor.column + shift + startPtn.length);
            }
            newSelection = Selection.fromPositions(newCursorPos, newCursorPos);
        } else {
            newSelection = Selection.fromPositions(
                prevSelection.getStartPosition().with(undefined, prevSelection.getStartPosition().column + shift),
                prevSelection.getEndPosition().with(undefined, prevSelection.getEndPosition().column + shift - ptnLength)
            );
        }
    } else {
        // add start/end patterns around range
        edits.push({range: range, text: startPtn + text + endPtn});

        shifts.push([range.getEndPosition(), ptnLength]);

        // Fix cursor position
        if (!isSelected) {
            if (!range.isEmpty) { // means quick styling
                if (cursor.column == range.getEndPosition().column) {
                    newCursorPos = cursor.with(undefined, cursor.column + shift + ptnLength);
                } else {
                    newCursorPos = cursor.with(undefined, cursor.column + shift + startPtn.length);
                }
            } else { // means `|` -> `**|**`
                newCursorPos = cursor.with(undefined, cursor.column + shift + startPtn.length);
            }
            newSelection = Selection.fromPositions(newCursorPos, newCursorPos);
        } else {
            newSelection = Selection.fromPositions(
                prevSelection.getStartPosition().with(undefined, prevSelection.getStartPosition().column + shift),
                prevSelection.getEndPosition().with(undefined, prevSelection.getEndPosition().column + shift + ptnLength)
            );
        }
    }

    newSelections[i] = newSelection;
    return edits;
}

function isWrapped(text: string, startPattern: string, endPattern?: string): boolean {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }
    return text.startsWith(startPattern) && text.endsWith(endPattern);
}

function getContext(editor: editor.ICodeEditor, cursorPos: Position, startPattern: string, endPattern?: string): string {
    if (endPattern == undefined) {
        endPattern = startPattern;
    }

    let startPositionColumn = cursorPos.column - startPattern.length;
    let endPositionColumn = cursorPos.column + endPattern.length;

    if (startPositionColumn < 0) {
        startPositionColumn = 0;
    }

    let model = editor.getModel();
    if (model != null) {
        let leftText = model.getValueInRange(new Range(cursorPos.lineNumber, startPositionColumn, cursorPos.lineNumber, cursorPos.column));
        let rightText = model.getValueInRange(new Range(cursorPos.lineNumber, cursorPos.column, cursorPos.lineNumber, endPositionColumn));

        if (rightText == endPattern) {
            if (leftText == startPattern) {
                return `${startPattern}|${endPattern}`;
            } else {
                return `${startPattern}text|${endPattern}`;
            }
        }
    }

    return '|';
}
