import * as vscode from 'vscode';
import { GitService } from '../services/git-service';

/**
 * 分支树项
 */
export class BranchTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly branchName: string,
        public readonly isCurrent: boolean,
        public readonly isRemote: boolean,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        this.tooltip = branchName;
        this.contextValue = isRemote ? 'remoteBranch' : 'localBranch';

        if (isCurrent) {
            this.iconPath = new vscode.ThemeIcon('check', new vscode.ThemeColor('gitDecoration.modifiedResourceForeground'));
            this.description = '当前';
        } else if (isRemote) {
            this.iconPath = new vscode.ThemeIcon('cloud');
        } else {
            this.iconPath = new vscode.ThemeIcon('git-branch');
        }
    }
}

/**
 * 分支数据提供者
 */
export class BranchProvider implements vscode.TreeDataProvider<BranchTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<BranchTreeItem | undefined | null | void> =
        new vscode.EventEmitter<BranchTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<BranchTreeItem | undefined | null | void> =
        this._onDidChangeTreeData.event;

    constructor(private gitService: GitService) { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BranchTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: BranchTreeItem): Promise<BranchTreeItem[]> {
        if (!element) {
            // 根节点：显示本地分支和远程分支分组
            return [
                new BranchTreeItem(
                    '本地分支',
                    'local',
                    false,
                    false,
                    vscode.TreeItemCollapsibleState.Expanded
                ),
                new BranchTreeItem(
                    '远程分支',
                    'remote',
                    false,
                    true,
                    vscode.TreeItemCollapsibleState.Collapsed
                )
            ];
        }

        try {
            const branches = await this.gitService.getBranches();
            const currentBranch = branches.current;

            if (element.branchName === 'local') {
                // 本地分支
                return branches.all
                    .filter(b => !b.startsWith('remotes/'))
                    .map(branch => {
                        const isCurrent = branch === currentBranch;
                        return new BranchTreeItem(
                            branch,
                            branch,
                            isCurrent,
                            false,
                            vscode.TreeItemCollapsibleState.None,
                            {
                                command: 'git-assistant.switchBranch',
                                title: '切换分支',
                                arguments: [branch]
                            }
                        );
                    });
            } else if (element.branchName === 'remote') {
                // 远程分支
                return branches.all
                    .filter(b => b.startsWith('remotes/'))
                    .map(branch => {
                        const displayName = branch.replace('remotes/', '');
                        return new BranchTreeItem(
                            displayName,
                            branch,
                            false,
                            true,
                            vscode.TreeItemCollapsibleState.None
                        );
                    });
            }

            return [];
        } catch (error) {
            vscode.window.showErrorMessage(`获取分支列表失败: ${error}`);
            return [];
        }
    }
}

