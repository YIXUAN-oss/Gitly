import * as vscode from 'vscode';
import { GitService } from '../services/git-service';
import { ConflictProvider } from '../providers/conflict-provider';

/**
 * 注册冲突解决命令
 */
export function registerConflictResolver(
    context: vscode.ExtensionContext,
    gitService: GitService,
    conflictProvider: ConflictProvider
) {
    // 解决冲突
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.resolveConflicts', async () => {
            try {
                // 获取冲突文件列表
                const conflicts = await gitService.getConflicts();

                if (conflicts.length === 0) {
                    vscode.window.showInformationMessage('当前没有冲突文件');
                    return;
                }

                // 显示冲突文件列表
                const items = conflicts.map(file => ({
                    label: `$(warning) ${file}`,
                    description: '存在冲突',
                    file: file
                }));

                const selected = await vscode.window.showQuickPick(items, {
                    placeHolder: `发现 ${conflicts.length} 个冲突文件，选择要解决的文件`
                });

                if (!selected) {
                    return;
                }

                // 打开冲突文件
                const document = await vscode.workspace.openTextDocument(selected.file);
                await vscode.window.showTextDocument(document);

                // 提供冲突解决选项
                const choice = await vscode.window.showQuickPick(
                    [
                        { label: '$(check) 接受当前更改', action: 'current' },
                        { label: '$(check) 接受传入更改', action: 'incoming' },
                        { label: '$(check) 接受所有更改', action: 'both' },
                        { label: '$(edit) 手动编辑', action: 'manual' }
                    ],
                    { placeHolder: '选择冲突解决方式' }
                );

                if (!choice) {
                    return;
                }

                if (choice.action === 'manual') {
                    vscode.window.showInformationMessage(
                        '请手动编辑文件解决冲突，完成后保存文件'
                    );
                    return;
                }

                // 自动解决冲突
                await resolveConflictAuto(document, choice.action);
                await document.save();

                vscode.window.showInformationMessage(
                    `✅ 冲突已解决，请检查并提交更改`
                );
                conflictProvider.refresh();

            } catch (error) {
                vscode.window.showErrorMessage(`解决冲突失败: ${error}`);
            }
        })
    );

    // 标记冲突已解决
    context.subscriptions.push(
        vscode.commands.registerCommand('git-assistant.markResolved', async (file?: string) => {
            try {
                if (!file) {
                    const editor = vscode.window.activeTextEditor;
                    if (!editor) {
                        vscode.window.showErrorMessage('请先打开冲突文件');
                        return;
                    }
                    file = editor.document.uri.fsPath;
                }

                await gitService.add(file);
                vscode.window.showInformationMessage(`✅ 文件 "${file}" 已标记为已解决`);
                conflictProvider.refresh();

            } catch (error) {
                vscode.window.showErrorMessage(`标记失败: ${error}`);
            }
        })
    );
}

/**
 * 自动解决冲突
 */
async function resolveConflictAuto(
    document: vscode.TextDocument,
    action: string
): Promise<void> {
    const edit = new vscode.WorkspaceEdit();
    const text = document.getText();

    // 匹配冲突标记
    const conflictPattern = /<<<<<<< HEAD\n([\s\S]*?)\n=======\n([\s\S]*?)\n>>>>>>> .+/g;

    let match;
    const replacements: { range: vscode.Range; text: string }[] = [];

    while ((match = conflictPattern.exec(text)) !== null) {
        const fullMatch = match[0];
        const currentChanges = match[1];
        const incomingChanges = match[2];

        let resolvedText = '';
        switch (action) {
            case 'current':
                resolvedText = currentChanges;
                break;
            case 'incoming':
                resolvedText = incomingChanges;
                break;
            case 'both':
                resolvedText = currentChanges + '\n' + incomingChanges;
                break;
        }

        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + fullMatch.length);
        replacements.push({
            range: new vscode.Range(startPos, endPos),
            text: resolvedText
        });
    }

    // 应用所有替换
    for (const replacement of replacements) {
        edit.replace(document.uri, replacement.range, replacement.text);
    }

    await vscode.workspace.applyEdit(edit);
}

