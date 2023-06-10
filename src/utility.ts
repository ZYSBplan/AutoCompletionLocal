import { workspace } from 'vscode';

export class CharPairMap {
  private openMapping: { [key: string]: number };
  private closeMapping: { [key: string]: number };
  private charsOpen: string[];
  private charsClose: string[];

  constructor(
    charsOpen: string[] = ['(', '[', '{', '<'],
    charsClose: string[] = [')', ']', '}', '>']
  ) {
    this.openMapping = {};
    this.closeMapping = {};
    this.charsOpen = charsOpen;
    this.charsClose = charsClose;

    this.charsOpen.fo