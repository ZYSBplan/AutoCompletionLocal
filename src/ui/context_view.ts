
import {
  FileType,
  TreeDataProvider,
  TreeItem,
  TreeItemCheckboxState,
  TreeItemCollapsibleState,
  Uri,
  window,
  workspace,
  EventEmitter,
  Event,
  ExtensionContext,
  TreeView,
  Disposable,
  TreeCheckboxChangeEvent,
  ConfigurationTarget,
} from 'vscode';

import { simpleGit, SimpleGit } from 'simple-git';
import { getContextFiles } from '../utility';

export class ContextItem extends TreeItem {
  constructor(
    public path: string,
    public isFile: boolean,
    public name: string
  ) {
    super(
      name,
      isFile
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Collapsed
    );

    this.tooltip = path;
    this.checkboxState = ContextItem.checkStatus(path)
      ? TreeItemCheckboxState.Checked
      : TreeItemCheckboxState.Unchecked;
    this.resourceUri = Uri.file(path);
  }

  static checkStatus(path: string) {
    return getContextFiles().includes(path);
  }
}

export class ContextSelectionProvider implements TreeDataProvider<ContextItem> {
  private git: SimpleGit;
  private _onDidChangeTreeData: EventEmitter<
    ContextItem | undefined | null | void
  > = new EventEmitter<ContextItem | undefined | null | void>();
  readonly onDidChangeTreeData: Event<ContextItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string | undefined) {
    workspace.onDidCreateFiles(() => this._onDidChangeTreeData.fire());
    workspace.onDidDeleteFiles(() => this._onDidChangeTreeData.fire());
    workspace.onDidRenameFiles(() => this._onDidChangeTreeData.fire());

    this.git = simpleGit(workspaceRoot);
  }

  getTreeItem(element: ContextItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
