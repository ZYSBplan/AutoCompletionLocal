import { Position, Range, TextDocument, Uri, window, workspace } from 'vscode';
import { getContextFiles, removeContextFile } from './utility';

export class CodeCompletions {
  completions: [string, string][] = [];
  maxCompletions = 10;

  constructor(maxCompletions: number = 10) {
    this.maxCompletions = maxCompletions;
  }

  private lastLine(text: string) {
    return text.