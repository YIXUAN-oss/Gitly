import * as vscode from 'vscode';
import { GitService } from '../services/git-service';
import { BranchProvider } from '../providers/branch-provider';
import { HistoryProvider } from '../providers/history-provider';
import { ConflictProvider } from '../providers/conflict-provider';
import { registerGitOperations } from './git-operations';
import { registerBranchManager } from './branch-manager';
import { registerConflictResolver } from './conflict-resolver';
import { registerRepositoryInit } from './repository-init';
import { registerTagManager } from './tag-manager';
import { DashboardPanel } from '../webview/dashboard-panel';

/**
 * 注册所有命令
 */
export function registerCommands(
    context: vscode.ExtensionContext,
    gitService: GitService,
    branchProvider: BranchProvider,
    historyProvider: HistoryProvider,
    conflictProvider: ConflictProvider
) {
    // 注册Git操作命令
    registerGitOperations(context, gitService, branchProvider, historyProvider);

    // 注册分支管理命令
    registerBranchManager(context, gitService, branchProvider);

    // 注册标签管理命令
    registerTagManager(context, gitService);

    // 注册冲突解决命令
    registerConflictResolver(context, gitService, conflictProvider);

    // 注册仓库初始化命令
    registerRepositoryInit(context, gitService, branchProvider, historyProvider);

    // 刷新分支列表
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.refreshBranches', () => {
            branchProvider.refresh();
            historyProvider.refresh();
            conflictProvider.refresh();
            vscode.window.showInformationMessage('已刷新 Git 数据');
        })
    );

    // 打开控制面板
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.openDashboard', () => {
            DashboardPanel.createOrShow(context.extensionUri, gitService);
        })
    );

    // 显示提交历史
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.showHistory', async () => {
            DashboardPanel.createOrShow(context.extensionUri, gitService);
            // 自动切换到历史视图
        })
    );
}

