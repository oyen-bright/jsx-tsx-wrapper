import * as vscode from "vscode";
import { CHARACTERS_AFTER_OPENING_TAG } from "../constants";

const getSelfClosingTag = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): { fullTag: string; element: string } | undefined => {
  const charBeforeSelection = getCharacterBefore(editor, selection);
  const selectedText = editor.document.getText(selection);
  const textAfterSelection = editor.document.getText(
    new vscode.Range(
      selection.end,
      editor.document.positionAt(
        editor.document.offsetAt(selection.end) + CHARACTERS_AFTER_OPENING_TAG
      )
    )
  );

  const tagMatch = textAfterSelection.match(/^[^>]*\/>/);
  if (charBeforeSelection === "<" && tagMatch) {
    const fullTag = charBeforeSelection + selectedText + tagMatch[0];
    const element = fullTag.match(/(<\w+)/)?.[1] + ">";
    return element ? { fullTag, element } : undefined;
  }
  return undefined;
};
const getOpeningTag: (
  editor: vscode.TextEditor,
  selection: vscode.Selection
) => { fullTag: string; element: string } | undefined = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): { fullTag: string; element: string } | undefined => {
  const charBeforeSelection = getCharacterBefore(editor, selection);
  const selectedText = editor.document.getText(selection);
  const textAfterSelection = editor.document.getText(
    new vscode.Range(
      selection.end,
      editor.document.positionAt(
        editor.document.offsetAt(selection.end) + CHARACTERS_AFTER_OPENING_TAG
      )
    )
  );

  const tagMatch = textAfterSelection.match(/^[^>]*>/);
  if (charBeforeSelection === "<" && tagMatch) {
    const fullTag = charBeforeSelection + selectedText + tagMatch[0];
    const element = fullTag.match(/(<\w+)/)?.[1] + ">";
    return element ? { fullTag, element } : undefined;
  }
  return undefined;
};

const getClosingTag = (
  editor: vscode.TextEditor,
  selection: vscode.Selection
): string | undefined => {
  const charAfterSelection = getCharacterAfter(editor, selection);
  const charBeforeSelection = getCharacterBefore(editor, selection, 2);
  const selectedText = editor.document.getText(selection);

  if (charBeforeSelection === "</" && charAfterSelection === ">") {
    return charBeforeSelection + selectedText + charAfterSelection;
  }
  return undefined;
};

const getCharacterAfter = (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  pos: number = 1
) => {
  return editor.document.getText(
    new vscode.Range(
      selection.end,
      new vscode.Position(selection.end.line, selection.end.character + pos)
    )
  );
};

const getCharacterBefore = (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  pos: number = 1
) => {
  return editor.document.getText(
    new vscode.Range(
      new vscode.Position(
        selection.start.line,
        selection.start.character - pos
      ),
      selection.start
    )
  );
};

export { getClosingTag, getOpeningTag, getSelfClosingTag };
