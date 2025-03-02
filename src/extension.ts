
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { LLMCompletionProvider } from './completion_provider';
import { commands } from './commands';
import { ContextSelectionView } from './ui/context_view';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('LocalCompletion is now active!');
  console.log('Version: ', context.extension.packageJSON['version']);
  LLMCompletionProvider.build();

  vscode.commands.executeCommand(
    'setContext',
    'localcompletion:useContextGitignore',
    vscode.workspace
      .getConfiguration('localcompletion')
      .get<boolean>('context_gitignore', true)
  );

  context.subscriptions.push(
    ContextSelectionView.build(context),
    vscode.languages.registerInlineCompletionItemProvider(
      { pattern: '**' },
      LLMCompletionProvider.instance()
    ),
    ...commands
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}