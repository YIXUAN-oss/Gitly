## Gitly 扩展（Visual Studio Code）

Gitly 是一个面向 VS Code 的 **Git 历史可视化与操作助手**。它提供 **提交图视图**、**侧边栏分支 / 历史 / 冲突视图**，以及一个 **可视化控制面板（Webview）**，支持 **英文 / 简体中文界面**。

![Gitly 演示](https://github.com/YIXUAN-oss/Gitly/raw/master/resources/demo.gif)

---

### 项目概览

- **定位**：为 VS Code 提供一体化的 Git 可视化管理能力，替代/增强内置 Git 视图。
- **核心能力**：
  - 图形化 Git 提交历史（分支、标签、远程等）
  - 侧边栏分支 / 历史 / 冲突管理视图
  - 可视化控制面板（Git 助手面板，提供快捷命令和统计视图）
  - 中英双语界面和文案
- **目标人群**：
  - 需要更强 Git 可视化能力的日常开发者
  - 进行 Code Review、分支管理、冲突处理的团队成员

如需英文说明，请参阅 `README_EN.md`。

---

### 主要功能

- **Gitly 主视图（提交图）**
  - **图形化展示**：本地 / 远程分支、HEAD、标签、远程仓库、暂存及未提交更改等
  - **右键菜单操作（提交 / 分支 / 标签）**：
    - **分支**：创建、检出、删除、获取、合并、拉取、推送、变基、重命名、重置等
    - **标签**：新增、删除、推送，查看注释标签详细信息（名称、作者邮箱、时间、说明）
    - **提交**：检出、cherry-pick、删除、合并、回滚
    - **工作区**：清理、重置、保存 / 应用 / 弹出 stash；从 stash 创建分支
    - **复制工具**：复制提交哈希、分支 / 标签 / stash 名称、文件路径等
  - **提交详情 / 对比视图**：
    - 打开任意文件的 VS Code Diff 视图
    - 在指定提交处打开文件当前版本
    - 复制受影响文件路径
    - 点击提交信息中的 HTTP/HTTPS 链接在浏览器中打开
    - 通过 `Ctrl/Cmd + 点击` 对比任意两个提交
  - **代码评审（Code Review）流程**：
    - 标记文件是否已评审
    - 评审状态在 VS Code 会话之间持久化（长时间无操作后自动关闭）
  - **过滤与搜索**：
    - 通过 **Branches 下拉框** 过滤分支（单选 / 多选 / 自定义 glob 规则）
    - **查找组件**：按提交信息、日期、作者、哈希、分支名、标签名搜索提交
  - **交互体验**：
    - 悬停提交可查看该提交是否在 HEAD 中、被哪些分支 / 标签 / stash 包含
    - 支持列宽拖拽、显示 / 隐藏日期 / 作者 / 提交列
    - 内置快捷键支持查找、滚动到 HEAD、刷新、滚动到 stash 等
    - 自动渲染常用 Emoji 短代码（包括 [gitmoji](https://gitmoji.carloscuesta.me/)）

- **Gitly 侧边栏视图（Activity Bar）**
  - **分支视图（`gitly.sidebar.branches`）**
    - 树形展示本地 / 远程分支
    - 一键切换分支、合并、重命名、删除等
    - 可快速跳转到 Gitly 主视图
  - **历史视图（`gitly.sidebar.history`）**
    - 聚焦最近提交，快速打开提交详情 / 图形视图 / Diff
  - **冲突视图（`gitly.sidebar.conflicts`）**
    - 展示当前存在冲突的文件
    - 提供快速入口到冲突解决工具与可视化面板

- **Gitly 可视化面板（Assistant Webview）**
  - **快捷指令（Quick Commands）**
    - 按仓库状态分组：初始化、远程配置、变更管理、提交、同步、分支、标签、冲突处理、工具等
  - **Git 指令集（Git Command Reference）**
    - 常用 Git 命令列表，可搜索、复制到剪贴板
  - **远程仓库管理（Remote Manager）**
    - 管理远程仓库，查看当前分支上游分支与默认推送远程
    - 一键在浏览器中打开远程仓库
  - **分支 / 标签管理**
    - 以列表方式浏览和操作本地 / 远程分支与标签
  - **冲突解决视图（Conflict Resolution）**
    - 展示冲突文件
    - 支持“接受当前更改 / 接受传入更改 / 接受所有更改”等策略
  - **时间线 & 热力图**
    - 简单的提交时间分布、文件修改频率、贡献者活跃度可视化
  - **完整的中英文本地化**
    - 可在 VS Code 设置中切换 `en` / `zh-CN`

- **多语言支持**
  - UI 字符串来源：
    - `package.nls.json`（英文）
    - `package.nls.zh-CN.json`（简体中文）
    - `web/assistant/i18n.ts`（可视化面板中使用）
  - 可通过 `gitly.language` 设置控制 Gitly 扩展内语言（见下文配置）。

---

### 安装与使用

1. **安装扩展**
   - 在 VS Code 扩展市场中搜索 **“Gitly”**（若未发布，可从源码通过 `vsce` 打包安装）。
2. **打开 Gitly 视图**
   - 通过命令面板执行：`Gitly: View Gitly (git log)`（命令 ID：`gitly.view`）
   - 或点击状态栏中的 Gitly 图标
3. **使用侧边栏与可视化面板**
   - 在侧边栏 Activity Bar 选择 **Gitly** 图标，展开：
     - 分支管理、提交历史、冲突解决等视图
   - 执行命令：`Gitly: 打开可视化面板`（命令 ID：`gitly.openAssistant`）打开控制面板

---

### 项目结构 / 技术栈

Gitly 基于 VS Code 扩展机制开发，采用 **TypeScript + Webview 前端** 的经典架构：

- **扩展后端（Extension Backend）**
  - 位置：`src/`
  - 作用：与 Git 仓库交互、管理数据模型、注册 VS Code 命令 / 视图 / Webview。
  - 关键文件示例：
    - `src/extension.ts`：扩展入口，注册命令、视图和 Webview。
    - `src/gitGraphView.ts`：提交图主视图（Gitly View）的管理逻辑。
    - `src/sidebarViews.ts`：侧边栏分支 / 历史 / 冲突视图。
    - `src/assistantPanel.ts`：可视化助手面板 Webview 的宿主与消息通信。
    - `src/repoManager.ts` / `src/repoFileWatcher.ts`：仓库管理与文件监听。
    - `src/logger.ts`：统一日志输出（VS Code Output Channel）。

- **Webview 前端（Git 图 & 相关 UI）**
  - 位置：`web/`
  - 作用：承载 Gitly 图形界面（提交图、时间线、设置等）。
  - 技术：TypeScript + 原生 DOM/Canvas/SVG + VS Code Webview API。
  - 关键文件示例：
    - `web/main.ts`：主 Webview 入口。
    - `web/graph.ts`：提交图绘制与交互。
    - `web/settingsWidget.ts` / `web/contextMenu.ts` 等：图视图中的设置与上下文菜单。

- **助手面板前端（Assistant Panel）**
  - 位置：`web/assistant/`
  - 作用：实现 Gitly 的可视化助手面板（快捷指令、远程管理、热力图等）。
  - 技术：TypeScript + 模块化组件。
  - 关键文件示例：
    - `web/assistant/app.ts`：助手面板入口。
    - `web/assistant/components/*`：各功能卡片/面板组件（远程管理、Tag 管理、冲突视图等）。
    - `web/assistant/i18n.ts`：助手面板的文案国际化。

- **公共工具与类型**
  - `src/utils.ts` / `src/utils/*`：通用工具函数（Git 命令封装、节流/防抖、数据转换等）。
  - `src/types.ts` / `out/types.d.ts`：核心类型定义，供前后端共用。
  - `web/utils.ts` / `web/styles/*`：前端工具与样式。

- **测试**
  - 位置：`tests/`
  - 说明：使用 Jest 对核心逻辑进行单元测试。
  - 示例：
    - `tests/repoManager.test.ts`：仓库管理逻辑。
    - `tests/gitGraphView.test.ts`：提交图视图行为。
    - `tests/logger.test.ts`：日志组件。

---

### 安装与使用

---

---

### 开发与构建

> 以下内容面向希望本地开发 / 二次定制 Gitly 的用户。  
> 如果你只是在 VS Code 中使用扩展，可以直接跳到下方「常用配置」。

1. **克隆仓库并安装依赖**
   - `git clone https://github.com/YIXUAN-oss/Gitly.git`
   - `cd Gitly`
   - `npm install`

2. **编译代码**
   - `npm run compile`：一次性编译后端 + Webview 前端（推荐）。
   - `npm run compile-src`：只编译扩展后端。
   - `npm run compile-web`：编译 Webview 前端（含助手面板），并进行打包/压缩。
   - `npm run compile-web-debug`：以调试模式编译前端（不压缩，便于调试）。

3. **在 VS Code 中调试扩展**
   - 在本仓库根目录打开 VS Code。
   - 按 **F5** 启动 *Extension Development Host*（扩展开发宿主）窗口。
   - 在新窗口中：
     - 打开命令面板执行 `Gitly: View Gitly (git log)` 查看提交图。
     - 执行 `Gitly: 打开可视化面板` 打开助手面板进行调试。
   - 如需调试前端，可通过命令 `Developer: Open Webview Developer Tools` 打开 Webview DevTools。

4. **测试与打包**
   - `npm test`：运行 Jest 测试。
   - `npm run package`：使用 `vsce` 打包扩展为 `.vsix` 文件。
   - `npm run package-and-install`：打包并在本地 VS Code 中自动安装。

更详细的开发流程，请参考 `CONTRIBUTING.md`。

---

### 常用配置

以下为最常用的 Gitly 配置项，完整列表可在 VS Code 设置界面中搜索 `gitly` 查看。

- **语言相关**
  - **`gitly.language`**：Gitly 扩展的显示语言
    - `"en"` – 英文界面
    - `"zh-CN"` – 简体中文界面

- **提交详情视图**
  - **`gitly.commitDetailsView.autoCenter`**：打开提交详情视图时自动居中
  - **`gitly.commitDetailsView.fileView.type`**：默认文件视图类型（`File Tree` / `File List`）
  - **`gitly.commitDetailsView.fileView.fileTree.compactFolders`**：是否压缩单链文件夹结构
  - **`gitly.commitDetailsView.location`**：提交详情视图在图形视图中内联显示或底部停靠

- **图形与仓库**
  - **`gitly.graph.colours` / `gitly.graph.style` / `gitly.graph.uncommittedChanges`**：图形样式配置
  - **`gitly.repository.commits.*`**：控制初始加载提交数量、加载更多行为、合并提交灰度显示、提交顺序等
  - **`gitly.repository.show*`**：控制是否显示远程分支、标签、stash、未提交与未跟踪文件
  - **`gitly.repository.fetchAndPrune` / `gitly.repository.fetchAndPruneTags`**：控制 fetch 时是否自动 prune
  - **`gitly.referenceLabels.*`**：分支 / 标签标签的对齐方式与组合方式

- **通用设置**
  - **`gitly.showStatusBarItem`**：是否在状态栏展示 Gitly 按钮
  - **`gitly.openNewTabEditorGroup`**：从 Gitly 打开文件 / Diff 时使用的编辑器分组
  - **`gitly.retainContextWhenHidden`**：Gitly 视图隐藏时是否保留上下文（换取更快恢复 vs. 更多内存）
  - **`gitly.enhancedAccessibility`**：启用额外的文件变更视觉指示（适合彩色弱 / 色盲用户）
  - **`gitly.fileEncoding`**：读取历史版本文件时使用的字符编码

Gitly 还会读取 VS Code 现有设置：

- **`git.path`**：Git 可执行文件路径（若你希望覆盖默认自动检测）。

---

### 贡献与开发

- 仓库地址：`https://github.com/YIXUAN-oss/Gitly`
- 如果你希望参与开发，可以：
  - 在 GitHub 上提交 Issue / Feature Request，描述你的场景与期望。
  - Fork 本仓库，在分支上实现你的改动后发起 Pull Request。
- 推荐阅读：
  - `CONTRIBUTING.md`：贡献指南（中文）。
  - `CODE_OF_CONDUCT.md`：行为准则。

---

### 版本与变更记录

完整更新日志见 [`CHANGELOG.md`](CHANGELOG.md)。  
说明：

- 直至 `1.30.0` 的大部分记录继承自上游项目 **Git Graph**；
- Gitly 自身的额外改动与特性在本仓库中继续演进与维护。

---

### 许可证与致谢

- 项目许可证见 `LICENSE`。Gitly 在遵守原许可证的前提下，基于 Git Graph 源码进行扩展。
- 特别感谢：
  - 原项目作者与所有贡献者：[Git Graph](https://github.com/mhutchie/vscode-git-graph)
  - 图标资源提供方：
    - [GitHub Octicons](https://octicons.github.com/)（许可证见其仓库说明）
    - [Icons8](https://icons8.com/icon/pack/free-icons/ios11)

