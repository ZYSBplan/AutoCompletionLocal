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