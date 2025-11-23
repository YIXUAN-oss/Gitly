import * as vscode from 'vscode';
import { GitService } from '../services/git-service';
import { BranchProvider } from '../providers/branch-provider';
import { HistoryProvider } from '../providers/history-provider';

/**
 * 注册仓库初始化相关命令
 */
export function registerRepositoryInit(
    context: vscode.ExtensionContext,
    gitService: GitService,
    branchProvider: BranchProvider,
    historyProvider: HistoryProvider
) {
    // 初始化仓库
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.initRepository', async () => {
            try {
                // 检查是否已经是Git仓库
                const isRepo = await gitService.isRepository();
                if (isRepo) {
                    vscode.window.showWarningMessage('当前文件夹已经是Git仓库');
                    return;
                }

                // 确认初始化
                const confirm = await vscode.window.showInformationMessage(
                    '是否在当前文件夹初始化Git仓库？',
                    { modal: false },
                    '初始化',
                    '取消'
                );

                if (confirm !== '初始化') {
                    return;
                }

                // 执行初始化
                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: '正在初始化Git仓库...',
                        cancellable: false
                    },
                    async (progress) => {
                        // 1. 初始化仓库
                        progress.report({ increment: 50, message: '初始化Git仓库...' });
                        await gitService.initRepository();

                        // 2. 重命名当前分支为 main（如果当前分支不是 main）
                        progress.report({ increment: 50, message: '重命名分支为 main...' });
                        try {
                            const branches = await gitService.getBranches();
                            const currentBranch = branches.current;

                            // 如果当前分支不是 main，则重命名为 main
                            if (currentBranch && currentBranch !== 'main') {
                                await gitService.renameCurrentBranch('main');
                            }
                        } catch (error) {
                            // 如果重命名失败，不影响初始化流程，只记录警告
                            console.warn('重命名分支失败:', error);
                        }
                    }
                );

                vscode.window.showInformationMessage('✅ Git仓库初始化成功！');

                // 询问是否添加远程仓库
                const addRemote = await vscode.window.showInformationMessage(
                    '是否添加远程仓库？',
                    '添加',
                    '稍后'
                );

                if (addRemote === '添加') {
                    await vscode.commands.executeCommand('git-assistant.addRemote');
                }

                // 刷新视图
                branchProvider.refresh();
                historyProvider.refresh();

            } catch (error) {
                vscode.window.showErrorMessage(`初始化失败: ${error}`);
            }
        })
    );

    // 添加远程仓库
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.addRemote', async () => {
            try {
                // 检查是否是Git仓库
                const isRepo = await gitService.isRepository();
                if (!isRepo) {
                    const init = await vscode.window.showWarningMessage(
                        '当前文件夹不是Git仓库，是否先初始化？',
                        '初始化',
                        '取消'
                    );
                    if (init === '初始化') {
                        await vscode.commands.executeCommand('git-assistant.initRepository');
                    }
                    return;
                }

                // 输入远程仓库名称
                const remoteName = await vscode.window.showInputBox({
                    prompt: '输入远程仓库名称',
                    value: 'origin',
                    placeHolder: 'origin',
                    validateInput: (value) => {
                        if (!value) {
                            return '请输入远程仓库名称';
                        }
                        if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                            return '名称只能包含字母、数字、下划线和横线';
                        }
                        return null;
                    }
                });

                if (!remoteName) {
                    return;
                }

                // 检查远程仓库是否已存在
                const remotes = await gitService.getRemotes();
                if (remotes.find(r => r.name === remoteName)) {
                    const overwrite = await vscode.window.showWarningMessage(
                        `远程仓库 "${remoteName}" 已存在，是否覆盖？`,
                        { modal: true },
                        '覆盖',
                        '取消'
                    );
                    if (overwrite === '覆盖') {
                        await gitService.removeRemote(remoteName);
                    } else {
                        return;
                    }
                }

                // 输入远程仓库地址
                const remoteUrl = await vscode.window.showInputBox({
                    prompt: '输入远程仓库地址',
                    placeHolder: 'https://github.com/username/repo.git',
                    validateInput: (value) => {
                        if (!value) {
                            return '请输入远程仓库地址';
                        }
                        if (!value.includes('http') && !value.includes('git@')) {
                            return '请输入有效的Git仓库地址';
                        }
                        return null;
                    }
                });

                if (!remoteUrl) {
                    return;
                }

                // 添加远程仓库
                await gitService.addRemote(remoteName, remoteUrl);

                vscode.window.showInformationMessage(
                    `✅ 远程仓库 "${remoteName}" 添加成功！`
                );

                // 询问是否进行初始提交
                const doCommit = await vscode.window.showInformationMessage(
                    '是否进行初始提交并推送？',
                    '是',
                    '稍后'
                );

                if (doCommit === '是') {
                    await vscode.commands.executeCommand('git-assistant.initialCommit');
                }

            } catch (error) {
                vscode.window.showErrorMessage(`添加远程仓库失败: ${error}`);
            }
        })
    );

    // 初始提交
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.initialCommit', async () => {
            try {
                // 检查是否是Git仓库
                const isRepo = await gitService.isRepository();
                if (!isRepo) {
                    vscode.window.showWarningMessage('当前文件夹不是Git仓库');
                    return;
                }

                // 获取仓库状态
                const status = await gitService.getStatus();
                const totalFiles = status.modified.length + status.created.length + status.not_added.length;

                if (totalFiles === 0) {
                    vscode.window.showInformationMessage('没有需要提交的文件');
                    return;
                }

                // 显示待提交文件
                const message = `准备添加 ${totalFiles} 个文件到暂存区`;
                const confirm = await vscode.window.showInformationMessage(
                    message,
                    { modal: false },
                    '继续',
                    '取消'
                );

                if (confirm !== '继续') {
                    return;
                }

                await vscode.window.withProgress(
                    {
                        location: vscode.ProgressLocation.Notification,
                        title: '正在处理文件...',
                        cancellable: false
                    },
                    async (progress) => {
                        // 1. 添加所有文件
                        progress.report({ increment: 25, message: '添加文件到暂存区...' });
                        await gitService.addAll();

                        // 2. 输入提交信息
                        const commitMessage = await vscode.window.showInputBox({
                            prompt: '输入提交信息',
                            value: 'Initial commit',
                            placeHolder: 'Initial commit',
                            validateInput: (value) => {
                                if (!value || value.trim().length === 0) {
                                    return '请输入提交信息';
                                }
                                return null;
                            }
                        });

                        if (!commitMessage) {
                            throw new Error('已取消提交');
                        }

                        // 3. 提交
                        progress.report({ increment: 25, message: '提交到本地仓库...' });
                        await gitService.commit(commitMessage);

                        // 4. 询问是否推送
                        progress.report({ increment: 25 });
                        const remotes = await gitService.getRemotes();

                        if (remotes.length > 0) {
                            const doPush = await vscode.window.showInformationMessage(
                                '是否推送到远程仓库？',
                                '推送',
                                '稍后'
                            );

                            if (doPush === '推送') {
                                progress.report({ increment: 25, message: '推送到远程仓库...' });
                                try {
                                    await gitService.pushSetUpstream();
                                    vscode.window.showInformationMessage('✅ 提交并推送成功！');
                                } catch (pushError) {
                                    vscode.window.showWarningMessage(
                                        `提交成功，但推送失败: ${pushError}\n请稍后手动推送`
                                    );
                                }
                            } else {
                                vscode.window.showInformationMessage('✅ 提交成功！');
                            }
                        } else {
                            vscode.window.showInformationMessage(
                                '✅ 提交成功！\n提示：尚未添加远程仓库，无法推送'
                            );
                        }
                    }
                );

                // 刷新视图
                branchProvider.refresh();
                historyProvider.refresh();

            } catch (error) {
                if (String(error).includes('已取消')) {
                    vscode.window.showInformationMessage('已取消提交');
                } else {
                    vscode.window.showErrorMessage(`提交失败: ${error}`);
                }
            }
        })
    );
}

