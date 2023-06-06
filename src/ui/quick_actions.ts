
import {
  ConfigurationTarget,
  InputBox,
  QuickPick,
  QuickPickItem,
  window,
  workspace,
} from 'vscode';
import { LLMCompletionProvider } from '../completion_provider';

export class EndpointPicker {
  private addNewTxt = '+ Add new API Endpoint';
  private endpoints: string[] = [];
  private completionProvider: LLMCompletionProvider;
  private quickPick: QuickPick<QuickPickItem>;
  private inputBox: InputBox;

  private newEndpoint = '';

  constructor() {
    this.completionProvider = LLMCompletionProvider.instance();
    this.endpoints = workspace
      .getConfiguration('localcompletion')
      .get('endpoints', [this.completionProvider.apiEndpoint]);
    const activeEndpoint = workspace
      .getConfiguration('localcompletion')