import { Position, Range, TextDocument, Uri, window, workspace } from 'vscode';
import { getContextFiles, removeContextFile } from './utility';

export class CodeCompletions {
  completions: [string, string][] = [];
  maxCompletion