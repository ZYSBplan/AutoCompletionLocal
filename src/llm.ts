import { OpenAI } from 'openai';
import { workspace } from 'vscode';

export class LLM {
  apiEndpoint = 'http://localhost:5001/v1';
  client: OpenAI;

  constructor() {
    this.apiEndpoint = workspace
      .getConfiguration('localcompletion')
      .get('active_endpoint', this.apiEndpoint);

    this.client = new OpenAI({
      apiKey: 'NONE',
      baseURL: this.apiEndpoint,
    });
  }

  async getCompletion(
    prompt: string,
    stop: string[] = [],
    temp: number | null = null,
    maxTokens: number | null = n