# 🔍 Git Assistant 项目验证和调试完整指南

本指南用于快速验证 Git Assistant 扩展是否工作正常，并在出现问题时提供排查路径。

---

## 📋 前置检查

在开始之前，确认以下工具版本满足要求：

```bash
# Node.js 16+
node --version

# npm
npm --version

# Git
git --version

# VS Code 1.80+
code --version
```

---

## 🚀 第一步：安装依赖

```bash
cd E:\CodeGitAssistant
npm install
```

> 预期输出：`added XXX packages ...`

如果失败：

```bash
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

---

## 🔨 第二步：编译项目

```bash
# 单次编译
npm run compile

# 监听模式（推荐开发时使用）
npm run watch
```

> 预期输出：
>
> ```
> webpack 5.x.x compiled successfully in xxx ms
> asset extension.js xxx KiB [emitted]
> asset webview.js xxx KiB [emitted]
> ```

如有错误：

```bash
npm run compile -- --display-error-details
```

---

## 🐛 第三步：启动调试

### 方法 A：VS Code（推荐）

1. 在 VS Code 中打开 `E:\CodeGitAssistant`
2. 终端运行 `npm run watch`
3. 按 `F5`（或运行 → 启动调试）
4. 出现 `[Extension Development Host]` 窗口

### 方法 B：使用 launch.json

`.vscode/launch.json` 中已配置：

```json
{
  "name": "运行扩展",
  "type": "extensionHost",
  "request": "launch",
  "args": [
    "--extensionDevelopmentPath=${workspaceFolder}"
  ]
}
```

---

## ✅ 第四步：功能验证

### 1. 准备测试仓库

```bash
mkdir E:\TestRepo
cd E:\TestRepo
git init
echo "# Test" > README.md
git add .
git commit -m "Initial commit"
code .
```

### 2. 验证扩展激活

- `Ctrl+Shift+X` → 搜索 Git Assistant → 显示“已启用”
- `Ctrl+Shift+U` → 选择“Git Assistant” → 日志显示“扩展已激活”

### 3. 验证侧边栏

- 分支管理
- 提交历史
- 冲突检测

### 4. 测试快捷键

| 快捷键       | 功能       | 预期结果           |
|--------------|------------|--------------------|
| `Ctrl+Alt+P` | 快速推送   | 弹出推送确认对话框 |
| `Ctrl+Alt+L` | 快速拉取   | 开始拉取操作       |
| `Ctrl+Alt+B` | 切换分支   | 显示分支列表       |

### 5. 测试命令面板

`Ctrl+Shift+P` → 输入 “Git Assistant” → 应出现全部命令（Push、Pull、Clone、Init、Add Remote、Initial Commit、创建/切换/合并分支等）

### 6. 测试控制面板

执行 `Git Assistant: 打开控制面板`：

- 显示仓库统计
- 快捷操作按钮可用
- 展示分支、提交历史

### 7. 测试分支管理

1. 创建分支 `test/feature-1`
2. 切换到该分支
3. 合并其他分支

### 8. 测试提交历史

- 列表显示最近提交
- 作者、时间显示正确
- 点击可查看详情

---

## 🔍 调试技巧

### 断点调试

```typescript
context.subscriptions.push(
    vscode.commands.registerCommand('git-assistant.quickPush', async () => {
        debugger; // 在此设置断点
    })
);
```

### 调试控制台

- 查看 `console.log` 输出
- 执行表达式，检查变量值

### 日志查看

- `Ctrl+Shift+U` → Git Assistant
- 帮助 → 切换开发人员工具 → Console

### Webview 调试

- 打开控制面板
- 右键 → “打开开发者工具”
- 使用 Chrome DevTools

---

## 🧪 验证清单

### 基础
- [ ] 扩展激活
- [ ] 侧边栏显示
- [ ] 命令面板无缺失
- [ ] 快捷键工作
- [ ] 控制面板加载

### Git 操作
- [ ] 查看状态
- [ ] 管理分支
- [ ] 拉取/推送
- [ ] 提交历史
- [ ] 在空文件夹使用 “初始化仓库 → 添加远程 → 初始提交” 完成首个推送

### UI
- [ ] 分支树
- [ ] 提交列表
- [ ] 控制面板样式
- [ ] 按钮响应

### 错误处理
- [ ] 非 Git 仓库提醒
- [ ] Git 操作失败提示
- [ ] 网络错误提示

---

## ❌ 常见问题

| 问题 | 排查 |
|------|------|
| 扩展未激活 | 确认 `workspaceContains:.git` 生效；确保文件夹有 `.git`；可执行 `Git Assistant: 初始化仓库` 或 `git init` |
| 命令不可用 | 可能不在 Git 仓库；先初始化 |
| 侧边栏图标丢失 | 右键活动栏 → 勾选 Git Assistant |
| Webview 空白 | 重新编译 `npm run compile`；确保 `dist/webview/webview.js` 存在 |
| TS 类型错误 | `npm install --save-dev @types/vscode @types/node` |

---

## 📊 调试输出示例

```
[Extension Host] Git Assistant 扩展已激活
[Git Assistant] INFO: 开始执行快速推送
```

---

## 🎯 性能验证

- Extension Host 启动 < 500ms
- 内存占用 < 50MB

---

## 📝 下一步

- 参阅 `docs/DEVELOPMENT.md`
- 在 `src/` 中修改功能
- 编写测试 / 优化性能
- `vsce package` 打包

---

## 🆘 需要帮助？

1. `Ctrl+Shift+U` → Git Assistant 日志
2. 开发者工具 Console
3. 文档：`README_CN.md` / `docs/DEVELOPMENT.md`

调试愉快！🎉

