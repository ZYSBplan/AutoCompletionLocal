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
import { St