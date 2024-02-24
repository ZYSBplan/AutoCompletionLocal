# AutoCompletionLocal

A locally based LLM for code completion that works with any OpenAI compatible API, similar to Copilot. The code does not contain a built-in backend for running LLMs, but allows you to use any existing tool that supports the OpenAI API format, such as the [Oobabooga WebUI](https://github.com/oobabooga/text-generation-webui) and many others.

## Features

- Inline and multi-line code completion
- Works with any OpenAI compatible API
- Option to toggle between multiple API Endpoints
- Reduces LLMs requests by saving previous responses, skipping completion depending on the last symbol, and only sending a request if there's no input for a certain duration (configurable in settings)
- Detec