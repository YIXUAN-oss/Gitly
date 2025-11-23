/**
 * Git相关类型定义
 */

export interface GitStatus {
    current: string | null;
    tracking: string | null;
    ahead: number;
    behind: number;
    modified: string[];
    created: string[];
    deleted: string[];
    renamed: string[];
    conflicted: string[];
    staged: string[];
    files: FileStatus[];
}

export interface FileStatus {
    path: string;
    index: string;
    working_dir: string;
}

export interface BranchInfo {
    current: string;
    all: string[];
    branches: {
        [key: string]: BranchDetail;
    };
}

export interface BranchDetail {
    current: boolean;
    name: string;
    commit: string;
    label: string;
}

export interface CommitInfo {
    hash: string;
    date: string;
    message: string;
    author_name: string;
    author_email: string;
    body: string;
    refs?: string;
}

export interface LogResult {
    all: CommitInfo[];
    total: number;
    latest: CommitInfo | null;
}

export interface Remote {
    name: string;
    refs: {
        fetch: string;
        push: string;
    };
}

export interface DiffResult {
    files: DiffFile[];
    insertions: number;
    deletions: number;
    changed: number;
}

export interface DiffFile {
    file: string;
    changes: number;
    insertions: number;
    deletions: number;
    binary: boolean;
}

export interface ConflictInfo {
    file: string;
    ours: string;
    theirs: string;
    ancestor?: string;
}

export interface StashEntry {
    index: number;
    message: string;
    date: string;
}

export interface TagInfo {
    name: string;
    commit: string;
    message?: string;
    date?: string;
}

