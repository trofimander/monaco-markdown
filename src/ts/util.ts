'use strict'

import {editor, Position, Range} from 'monaco-editor';

export function isInFencedCodeBlock(doc: editor.ITextModel, lineNum: number): boolean {
    let textBefore = doc.getValueInRange(Range.fromPositions(new Position(0, 0), new Position(lineNum, 0)));
    let matches = textBefore.match(/^```[\w ]*$/gm);
    if (matches == null) {
        return false;
    } else {
        return matches.length % 2 != 0;
    }
}
