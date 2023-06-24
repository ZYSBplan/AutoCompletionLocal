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

    this.charsOpen.forEach(
      (bracket, index) => (this.openMapping[bracket] = index)
    );
    this.charsClose.forEach(
      (bracket, index) => (this.closeMapping[bracket] = index)
    );
  }

  /** Create CharPairMap from a key-value array */
  public static fromKeyValuePairs(charPairs: { [key: string]: string }) {
    const charsOpen = Object.keys(charPairs);
    const charsClose = Object.values(charPairs);

    return new CharPairMap(charsOpen, charsClose);
  }

  public isOpen(char: string) {
    return this.openMapping[char] !== undefined;
  }

  public isClose(char: string) {
    return this.closeMapping[char] !== undefined;
  }

  public getOpen(char: string) {
    return this.ch