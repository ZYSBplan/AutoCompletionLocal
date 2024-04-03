# AutoCompletionLocal

A locally based LLM for code completion that works with any OpenAI compatible API, similar to Copilot. The code does not contain a built-in backend for running LLMs, but allows you to use any existing tool that supports the OpenAI API format, such as the [Oobabooga WebUI](https://github.com/oobabooga/text-generation-webui) and many others.

## Features

- Inline and multi-line code completion
- Works with any OpenAI compatible API
- Option to toggle between multiple API Endpoints
- Reduces LLMs requests by saving previous responses, skipping completion depending on the last symbol, and only sending a request if there's no input for a certain duration (configurable in settings)
- Detects multi-line and single-line completion dynamically
- Ability to add extra files to improve the output

### Roadmap

- Adding more intuitive features to lessen LLM requests
- Augment context to enhance output
- Project Context augmentation using embeddings or similar
- Provide multiple completions based on history
- Improve detection and reduction of repeated symbols at completion end
- Custom completion stopping based on bracket/brace/parenthesis imbalance
- Preview of the first line of completion while the completion job is still ongoing

## Extension Settings

Various settings including active_endpoint, endpoints, temperature, max_tokens, stop_sequences, reduce_calls, skip_autocomplete_widget, completion_timeout, max_lines, add_visible_files, context_files, and context_gitignore.

## Known Issues

- The extension does not yet support a custom API key. This means it only works for APIs which do not need a key.
- Model switching is not supported at the moment as most local tools don't support that property either.
- Symlinks can cause problems with a