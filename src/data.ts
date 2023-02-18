import { Position, Range, TextDocument, Uri, window, workspace } from 'vscode';
import { getContextFiles, removeContextFile } from './utility';

export class CodeCompletions {
  completions: [string, string][] = [];
  maxCompletions = 10;

  constructor(maxCompletions: number = 10) {
    this.maxCompletions = maxCompletions;
  }

  private lastLine(text: string) {
    return text.split('\n').at(-1) || '';
  }

  /** Add new completion to history.
   *  Remove items from history if `maxCompletions` is exceeded
   */
  public add(input: string, completion: string) {
    this.completions.unshift([input, completion]);

    if (this.completions.length > this.maxCompletions) {
      this.completions.pop();
    }
  }

  /** Get prediction from history based on the prompt
   *
   * *Includes the complete line! It does not start from the cursor position*
   */
  public get(prompt: string): string[] | null {
    if (this.completions.length <= 0) {
      return null;
    }

    if (this.lastLine(prompt).trim() === '') {
      return null;
    }

    const lastPrediciton = this.c