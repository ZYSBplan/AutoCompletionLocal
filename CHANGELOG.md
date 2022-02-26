# Change Log

## [Unreleased]

## [0.3.0]

### Added

- New view for selecting additional context
  - Optionally files, mentioned in the .gitignore are automatically excluded from the context selection

## [0.1.4]

- Add status bar item with feed back when completion is ongoing or deactivated
- Add visible files to completion context (can be disabled in settings)

## [0.1.2]

- Add maximum number of lines for completion
- Fix leading space in completion (this time for real)

## [0.1.1]

- Fix race condition error which crashed the extension
- Fix extra space at the start of single line completion

## [0.1.0]

- Publish to Visual Studio Marketplace

## [0.0.5]

- Increase time between keystrokes before requesting a new completion
- Show inline completion even if autocomplet widget is active (can be disabled)
- Fix bug where sometimes a running completion would not be stopped if a new completion is triggered

## [0.0.4]

- Distinguish between single line and multiline completion by checking text after the cursor
- Add '\n' to stop token for single line
- Reduce repetition of already