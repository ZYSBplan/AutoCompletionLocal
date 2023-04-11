import { OpenAI } from 'openai';
import { workspace } from 'vscode';

export class LLM {
  apiEndpoint = 'http://localhost:5001/v1';
  client: OpenAI;

  constructor() {
