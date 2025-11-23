import React, { useState } from 'react';

/**
 * 分支树组件
 */
export const BranchTree: React.FC<{ data: any }> = ({ data }) => {
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

    const handleBranchClick = (branchName: string) => {
        setSelectedBranch(branchName);
    };

    const handleSwitchBranch = (branchName: string) => {
        vscode.postMessage({
            command: 'switchBranch',
            branch: branchName
        });
    };

    const handleMergeBranch = (branchName: string) => {
        vscode.postMessage({
            command: 'mergeBranch',
            branch: branchName
        });
    };

    if (!data?.branches) {
        return (
            <div className="empty-state">
                <p>🌿 正在加载分支信息...</p>
            </div>
        );
    }

    const localBranches = data.branches.all.filter((b: string) => !b.startsWith('remotes/'));
    const remoteBranches = data.branches.all.filter((b: string) => b.startsWith('remotes/'));
    const currentBranch = data.branches.current;

    return (
        <div className="branch-tree">
            <div className="section-header">
                <h2>分支管理</h2>
                <button
                    className="primary-button"
                    onClick={() => vscode.postMessage({ command: 'createBranch' })}
                >
                    ➕ 创建新分支
                </button>
            </div>

            <div className="branch-section">
                <h3>📁 本地分支 ({localBranches.length})</h3>
                <div className="branch-list">
                    {localBranches.map((branch: string) => (
                        <div
                            key={branch}
                            className={`branch-item ${branch === currentBranch ? 'current' : ''} ${branch === selectedBranch ? 'selected' : ''
                                }`}
                            onClick={() => handleBranchClick(branch)}
                        >
                            <div className="branch-info">
                                <span className="branch-icon">
                                    {branch === currentBranch ? '✓' : '○'}
                                </span>
                                <span className="branch-name">{branch}</span>
                                {branch === currentBranch && (
                                    <span className="branch-badge">当前</span>
                                )}
                            </div>
                            {branch !== currentBranch && (
                                <div className="branch-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSwitchBranch(branch);
                                        }}
                                        title="切换到此分支"
                                    >
                                        🔀
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMergeBranch(branch);
                                        }}
                                        title="合并此分支"
                                    >
                                        🔗
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="branch-section">
                <h3>☁️ 远程分支 ({remoteBranches.length})</h3>
                <div className="branch-list">
                    {remoteBranches.map((branch: string) => (
                        <div
                            key={branch}
                            className="branch-item"
                            onClick={() => handleBranchClick(branch)}
                        >
                            <div className="branch-info">
                                <span className="branch-icon">☁️</span>
                                <span className="branch-name">
                                    {branch.replace('remotes/', '')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

