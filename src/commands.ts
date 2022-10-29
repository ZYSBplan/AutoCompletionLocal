
import {
  window,
  workspace,
  commands as vscommands,
  ConfigurationTarget,
} from 'vscode';
import { LLMCompletionProvider } from './completion_provider';
import { EndpointPicker } from './ui/quick_actions';
import { ContextSelectionView } from './ui/context_view';

function setEndpoint() {
  const endpointPicker = new EndpointPicker();
  endpointPicker.show();
}

function toggle() {
  const enabled = workspace
    .getConfiguration('editor')
    .get('inlineSuggest.enabled', true);

  workspace
    .getConfiguration('editor')
    .update('inlineSuggest.enabled', !enabled, ConfigurationTarget.Global);

  LLMCompletionProvider.instance().updateSettings();

  if (!enabled) {
    LLMCompletionProvider.instance().statusBarItem.setInactive();
  } else {
    LLMCompletionProvider.instance().statusBarItem.setOff();
  }

  window.showInformationMessage(
    `LocalCompletion ${!enabled ? 'enabled' : 'disabled'}!`
  );
  console.debug("Toggled 'inlineSuggest.enabled'");
}

function regenerate() {