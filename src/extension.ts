// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { once } from "events";
import * as vscode from "vscode";
import handleWrapWithElement from "./useCases/wrapWithElement";
import handleRemoveElement from "./useCases/removeElement";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  const createCommand = (commandId: string, message: string) => {
    return vscode.commands.registerCommand(
      "jsx-tsx-wrapper." + commandId,
      () => {
        switch (commandId) {
          case "remove":
            vscode.window.showInformationMessage(
              "🚧 Remove element is not implemented yet. Stay tuned! 🚧"
            );
            break;
          case "add":
            addElement();
            break;
          case "div":
            createDiv();
            break;
          case "span":
            createSpan();
            break;
          case "p":
            createP();
            break;
          case "a":
            createA();
            break;
          default:
            vscode.window.showInformationMessage(
              `Unknown command: ${commandId}`
            );
            break;
        }
      }
    );
  };

  const removeElement = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        handleRemoveElement(editor);
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showInformationMessage(error.message);
        } else {
          vscode.window.showInformationMessage(String(error));
        }
      }
      return;
    }
  };

  const addElement = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        handleWrapWithElement(editor, null);
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showInformationMessage(error.message);
        } else {
          vscode.window.showInformationMessage(String(error));
        }
      }
      return;
    }
  };

  const createDiv = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        handleWrapWithElement(editor, "div");
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showInformationMessage(error.message);
        } else {
          vscode.window.showInformationMessage(String(error));
        }
      }
      return;
    }
  };

  const createSpan = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        handleWrapWithElement(editor, "span");
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showInformationMessage(error.message);
        } else {
          vscode.window.showInformationMessage(String(error));
        }
      }
      return;
    }
  };

  const createP = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        handleWrapWithElement(editor, "p");
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showInformationMessage(error.message);
        } else {
          vscode.window.showInformationMessage(String(error));
        }
      }
      return;
    }
  };

  const createA = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      try {
        handleWrapWithElement(editor, "a");
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showInformationMessage(error.message);
        } else {
          vscode.window.showInformationMessage(String(error));
        }
      }
      return;
    }
  };

  const commandDiv = createCommand("div", "div");
  const commandSpan = createCommand("span", "span");
  const commandP = createCommand("p", "p");
  const commandA = createCommand("a", "a");
  const commandAdd = createCommand("add", "add");
  const commandRemove = createCommand("remove", "remove");

  context.subscriptions.push(commandDiv);
  context.subscriptions.push(commandSpan);
  context.subscriptions.push(commandP);
  context.subscriptions.push(commandA);
  context.subscriptions.push(commandAdd);
  context.subscriptions.push(commandRemove);
}
// This method is called when your extension is deactivated
export function deactivate() {}
