import { workspace } from 'vscode';

export class CharPairMap {
  private openMapping: { [key: string]: number };
  private closeMapping: { [key: string]: number };
  private 