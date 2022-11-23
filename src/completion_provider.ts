import {
  InlineCompletionContext,
  InlineCompletionItem,
  InlineCompletionItemProvider,
  InlineCompletionList,
  TextDocument,
  Position,
  CancellationToken,
  ProviderResult,
  Range,
  workspace,
  InlineCompletionTriggerKind,
  window,
} from 'vscode';

import { OpenAI } from 'openai';
import { Stream } from 'openai/streaming';
import { CodeCompletions, PromptBuilder } from './data';
import { trimLines, countLines, trimSpacesEnd } from './utility';
import { CompletionStatusBarItem } from './ui/status_bar_item';

export class LLMCompletionProvider implements InlineCompletionItemProvider {
  apiEndpoint = 'http://localhost:5001/v1';
  enabled = true;

  //@ts-ignore
  client: OpenAI;
  onGoingStream: Stream<OpenAI.Completions.Completion> | undefined;
  hasOnGoingStream = false;

  lastResponses: CodeCompletions;
  statusBarItem: CompletionStatusBarItem;

  private static _instance: LLMCompletionProvider;

  /** Get singleton instance of this class */
  static instance() {
    if (!LLMCompletionProvider._instance) {
      //LLMCompletionProvider._instance = new LLMCompletionProvider();
      throw Error(
        'Tried to access LLMCompletionProvider Instance before building'
      );
    }

    return LLMCompletionProvider._instance;
  }

  /** Build a new instance of this class */
  static build() {
    LLMCompletionProvider._instance = new LLMCompletionProvider();
    return LLMCompletionProvider._instance;
  }

  constructor() {
    this.updateSettings();
    this.lastResponses = new CodeCompletions();
    this.statusBarItem = new CompletionStatusBarItem();
  }

  /** Update variables which depend on extension settings. Should be called if the settings are changed */
  updateSettings() {
    this.enabled = workspace
      .getConfiguration('editor')
      .get('inlineSuggest.enabled', true);
    this.apiEndpoint = workspace
      .getConfiguration('localcompletion')
      .get('active_endpoint', this.apiEndpoint);

    this.client = new OpenAI({
      apiKey: 'NONE',
      baseURL: this.apiEndpoint,
    });
  }

  /** Async sleep */
  async completionTimeout(): Promise<unknown> {
    const ms = workspace
      .getConfiguration('localcompletion')
      .get('completion_timeout', 0);

    if (ms <= 0) {
      return 0;
    }

    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Execute completion */
  private async getCompletion(prompt: string, stop: string[] = []) {
    return await this.client.completions.create({
      model: 'NONE',
      prompt,
      stream: true,
      temperature: workspace
        .getConfiguration('localcompletion')
        .get('temperature'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      max_tokens: workspace
        .getConfiguration('localcompletion')
        .get('max_tokens'),
      stop: [
        '\n\n\n',
   