import {editor, Range as _Range, Position as _Position, IRange, ISelection, IPosition} from "monaco-editor";

import * as vscode from "./extHostTypes";

export interface PositionLike {
    line: number;
    character: number;
}

export interface RangeLike {
    start: PositionLike;
    end: PositionLike;
}

export interface SelectionLike extends RangeLike {
    anchor: PositionLike;
    active: PositionLike;
}

export namespace Selection {

    export function to(selection: ISelection): vscode.Selection {
        const {selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn} = selection;
        const start = new vscode.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
        const end = new vscode.Position(positionLineNumber - 1, positionColumn - 1);
        return new vscode.Selection(start, end);
    }

    export function from(selection: SelectionLike): ISelection {
        const {anchor, active} = selection;
        return {
            selectionStartLineNumber: anchor.line + 1,
            selectionStartColumn: anchor.character + 1,
            positionLineNumber: active.line + 1,
            positionColumn: active.character + 1
        };
    }
}
export namespace Range {

    export function from(range: undefined): undefined;
    export function from(range: RangeLike): _Range;
    export function from(range: RangeLike | undefined): _Range | undefined;
    export function from(range: RangeLike | undefined): _Range | undefined {
        if (!range) {
            return undefined;
        }
        const {start, end} = range;
        return new _Range(
            start.line + 1,
            start.character + 1,
            end.line + 1,
            end.character + 1
        );
    }

    export function to(range: undefined): vscode.Range;
    export function to(range: IRange): vscode.Range;
    export function to(range: IRange | undefined): vscode.Range | undefined;
    export function to(range: IRange | undefined): vscode.Range | undefined {
        if (!range) {
            return undefined;
        }
        const {startLineNumber, startColumn, endLineNumber, endColumn} = range;
        return new vscode.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
    }
}

export namespace Position {
    export function to(position: IPosition): vscode.Position {
        return new vscode.Position(position.lineNumber - 1, position.column - 1);
    }

    export function from(position: vscode.Position): IPosition {
        return {lineNumber: position.line + 1, column: position.character + 1};
    }
}

export namespace EndOfLine {
    export function from(eol: vscode.EndOfLine): editor.EndOfLineSequence | undefined {
        if (eol === vscode.EndOfLine.CRLF) {
            return editor.EndOfLineSequence.CRLF;
        } else if (eol === vscode.EndOfLine.LF) {
            return editor.EndOfLineSequence.LF;
        }
        return undefined;
    }

    export function to(eol: editor.EndOfLineSequence): vscode.EndOfLine | undefined {
        if (eol === editor.EndOfLineSequence.CRLF) {
            return vscode.EndOfLine.CRLF;
        } else if (eol === editor.EndOfLineSequence.LF) {
            return vscode.EndOfLine.LF;
        }
        return undefined;
    }
}
