
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

  getChildren(element?: ContextItem | undefined): Thenable<ContextItem[]> {
    if (!this.workspaceRoot) {
      window.showInformationMessage(
        'Unable to extend context in empty workspace!'
      );
      return Promise.resolve([]);
    }

    if (!element) {
      return Promise.resolve(this.getFilesInDirectory(this.workspaceRoot));
    }

    if (!element.isFile) {
      return Promise.resolve(this.getFilesInDirectory(element.path));
    }

    return Promise.resolve([]);
  }

  /** Return all file in the given directory */
  async readDirectory(
    path: string,
    gitignore: boolean | undefined = undefined
  ) {
    if (gitignore === undefined) {
      gitignore = workspace
        .getConfiguration('localcompletion')
        .get<boolean>('context_gitignore');
    }

    let files = await workspace.fs.readDirectory(Uri.file(path));

    if (gitignore) {
      let ignore: string[] = [];

      try {
        ignore = await this.git.checkIgnore(
          files.map((f) => `${path}/${f[0]}`)
        );
      } catch (err: any) {
        if (!err.message.includes('fatal: not a git repository')) {
          throw err;
        }
      }
      files = files.filter((f) => !ignore.includes(`${path}/${f[0]}`));
    }

    return files;
  }

  /** Get all files and directories at a given path */
  async getFilesInDirectory(path: string) {
    const files = await this.readDirectory(path);

    return files
      .map(([f, fileType]) => {
        return new ContextItem(path + '/' + f, fileType === FileType.File, f);
      })
      .sort((a, b) => Number(a.isFile) - Number(b.isFile));