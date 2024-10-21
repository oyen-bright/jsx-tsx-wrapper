import * as vscode from "vscode";
import {
  getClosingTag,
  getOpeningTag,
  getSelfClosingTag,
} from "../utils/getTags";

export default (editor: vscode.TextEditor, element: string | null) => {
  try {
    const selection = editor.selection;

    const selfClosingTag = getSelfClosingTag(editor, selection);
    if (selfClosingTag) {
      const insertPosition = HandleSelfClosingTags(editor.document, selection);
      if (!insertPosition) {
        return;
      }
      addElementToDocument(
        insertPosition.startPosition,
        insertPosition.endPosition,
        element,
        editor
      );
      return;
    }

    const openingTag = getOpeningTag(editor, selection);

    if (openingTag) {
      const insertPosition = HandleOpeningTags(
        editor.document,
        selection,
        openingTag
      );
      if (!insertPosition) {
        return;
      }
      addElementToDocument(
        insertPosition.startPosition,
        insertPosition.endPosition,
        element,
        editor
      );
      return;
    }

    const closingTag = getClosingTag(editor, selection);

    if (closingTag) {
      const insertPosition = HandleClosingTags(
        editor.document,
        selection,
        closingTag
      );
      if (!insertPosition) {
        return;
      }
      addElementToDocument(
        insertPosition.startPosition,
        insertPosition.endPosition,
        element,
        editor
      );
      return;
    }
  } catch (error) {
    throw error;
  }
};

const HandleSelfClosingTags = (
  document: vscode.TextDocument,
  selection: vscode.Selection
): { startPosition: vscode.Position; endPosition: vscode.Position } | null => {
  const closingTag = "/>";
  let selectionLine = selection.start.line;
  let closingTagOnLine;
  let closingCharOnIndex;

  // <= element might be on the same line
  while (selectionLine <= document.lineCount) {
    /**
     * Retrieves the text of a specified line within a document, adjusting the start position
     * based on the user's selection. This function assumes that the user highlights only the 
     * tag name (e.g., "p" in "<p>") and adjusts the start position to include the opening "<".

     */
    const lineText = document.getText(
      new vscode.Range(
        new vscode.Position(
          selectionLine,
          selection.start.line === selectionLine
            ? selection.start.character - 1
            : 0
        ),
        new vscode.Position(
          selectionLine,
          document.lineAt(selectionLine).text.length
        )
      )
    );

    if (!lineText.includes(closingTag)) {
      selectionLine++;
      continue;
    }

    closingTagOnLine = selectionLine;
    closingCharOnIndex = lineText.indexOf(closingTag) + closingTag.length;
    if (closingTagOnLine === selection.start.line) {
      const lineText = document.lineAt(closingTagOnLine).text;
      const trimmedLineText = lineText.trim();
      const emptySpaceCount = lineText.length - trimmedLineText.length;
      if (emptySpaceCount) {
        closingCharOnIndex = closingCharOnIndex + emptySpaceCount;
      }
    }

    break;
  }

  if (closingTagOnLine !== undefined && closingCharOnIndex !== undefined) {
    const startPosition = new vscode.Position(
      selection.start.line,
      selection.start.character - 1
    );
    const endPosition = new vscode.Position(
      closingTagOnLine,
      closingCharOnIndex
    );
    return { startPosition, endPosition };
  }

  throw new Error("Closing Tag not found");
};

const HandleOpeningTags = (
  document: vscode.TextDocument,
  selection: vscode.Selection,
  openingTag: {
    fullTag: string;
    element: string;
  }
): { startPosition: vscode.Position; endPosition: vscode.Position } | null => {
  const { fullTag, element } = openingTag;
  const text = document.getText();
  let selectionLine = selection.start.line;

  //Check for other closing tage in the rand
  let matchingClosingTagCount = -1;

  //Remove the / and the end of open elemment
  const opening = element.substring(0, element.length - 1);

  //Create a closing tag form open tag
  const closingTag = element.slice(0, 1) + "/" + element.slice(1);

  let closingTagOnLine: number | undefined;
  let closingCharOnIndex;

  while (selectionLine !== document.lineCount) {
    const lineText = document.getText(
      new vscode.Range(
        //if its the same line start from -1 to include <
        new vscode.Position(
          selectionLine,
          selection.start.line === selectionLine
            ? selection.start.character - 1
            : 0
        ),
        new vscode.Position(
          selectionLine,
          document.lineAt(selectionLine).text.length
        )
      )
    );
    if (lineText.includes(opening)) {
      matchingClosingTagCount++;
    }
    if (lineText.includes(closingTag)) {
      if (matchingClosingTagCount !== 0) {
        matchingClosingTagCount--;
        selectionLine++;
        continue;
      }
      closingTagOnLine = selectionLine;
      closingCharOnIndex = lineText.lastIndexOf(closingTag) + closingTag.length;

      //Bug if value is on the sameline add trimmedleght
      if (closingTagOnLine === selection.start.line) {
        const lineText = document.lineAt(closingTagOnLine).text;

        const trimmedLineText = lineText.trim();
        const emptySpaceCount = lineText.length - trimmedLineText.length;
        if (emptySpaceCount) {
          closingCharOnIndex = closingCharOnIndex + emptySpaceCount;
        }
      }

      break;
    }
    selectionLine++;
  }

  if (closingTagOnLine !== undefined && closingCharOnIndex !== undefined) {
    const endPosition = new vscode.Position(
      closingTagOnLine,
      closingCharOnIndex
    );
    const startPosition = new vscode.Position(
      selection.start.line,
      selection.start.character - 1
    );
    return { startPosition, endPosition };
  }
  throw new Error("Closing Tag not found");
};

const HandleClosingTags = (
  document: vscode.TextDocument,
  selection: vscode.Selection,
  closingTag: string
): { startPosition: vscode.Position; endPosition: vscode.Position } | null => {
  let selectionLine = selection.start.line;
  let matchingOpeningTagCount = -1;
  const openingTag = closingTag.replace("/", "").replace(">", "");

  let onLine;
  let onIndex;

  while (selectionLine >= 0) {
    const lineText = document.getText(
      new vscode.Range(
        new vscode.Position(selectionLine, 0),
        new vscode.Position(
          selectionLine,
          document.lineAt(selectionLine).text.length
        )
      )
    );

    if (lineText.includes(closingTag)) {
      matchingOpeningTagCount++;
    }
    if (lineText.includes(openingTag)) {
      if (matchingOpeningTagCount !== 0) {
        matchingOpeningTagCount--;
        selectionLine--;
        continue;
      }

      onLine = selectionLine;
      onIndex = lineText.indexOf(openingTag);
      if (onLine === selection.start.line) {
        const lineText = document.lineAt(onLine).text;

        const trimmedLineText = lineText.trim();
        const emptySpaceCount = lineText.length - trimmedLineText.length;
        if (emptySpaceCount) {
          onIndex = onIndex - emptySpaceCount;
        }
      }

      break;
    }
    selectionLine--;
  }

  if (onLine !== undefined && onIndex !== undefined) {
    const startPosition = new vscode.Position(onLine, onIndex);
    const endPosition = new vscode.Position(
      selection.start.line,
      selection.start.character + closingTag.length
    );
    return { startPosition, endPosition };
  }
  throw new Error("Opening Tag not found");
};

const addElementToDocument = (
  startPosition: vscode.Position,
  endPosition: vscode.Position,
  element: string | null,
  editor: vscode.TextEditor
) => {
  const range = new vscode.Range(startPosition, endPosition);
  editor
    .edit((editBuilder) => {
      if (element) {
        editBuilder.insert(range.start, `<${element}>\n`);
        editBuilder.insert(range.end, `\n</${element}>`);
      } else {
        editBuilder.insert(range.start, `<>`);
        editBuilder.insert(range.end, `</>`);
      }
    })
    .then(() => {
      if (element) {
        vscode.commands
          .executeCommand("prettier.forceFormatDocument")
          .then((success) => {
            if (!success) {
              vscode.commands.executeCommand("editor.action.formatDocument");
            }
          });
      } else {
        const startCursorPosition = new vscode.Position(
          startPosition.line,
          startPosition.character + 1
        );
        const endCursorPosition = new vscode.Position(
          endPosition.line,
          endPosition.character + 2
        );
        editor.selections = [
          new vscode.Selection(startCursorPosition, startCursorPosition),
          new vscode.Selection(endCursorPosition, endCursorPosition),
        ];
      }
    });
};
