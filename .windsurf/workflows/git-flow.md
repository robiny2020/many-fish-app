---
description: 读取 Git 暂存区/工作区的修改内容，自动生成规范的 commit message，提交并推送
---

# Git Flow — 提交推送工作流

> **`REPO_PATH`**：当前工作区根目录（即包含 `.git` 的目录）。执行本工作流时，先通过用户的活跃工作区信息确定 `REPO_PATH`，后续所有 git MCP 工具调用和 bash 命令均使用该路径。

## 步骤 1：检测当前分支

使用 git MCP 工具获取本地分支列表：

```tool
mcp3_git_branch(repo_path=REPO_PATH, branch_type="local")
```

从结果中识别当前分支（带 `*` 标记的分支）。

**保护分支检测：** 如果当前分支为 `main` 或 `master`，提醒用户「当前在保护分支上，建议切换到功能分支再提交」，由用户决定是否继续。

## 步骤 2：检测变更来源

使用 git MCP 工具检查变更状态：

```tool
mcp3_git_status(repo_path=REPO_PATH)
```

**判断逻辑：**

- 暂存区**有内容**且工作区**无变更** → 步骤 3 使用 `mcp3_git_diff_staged`
- 暂存区**有内容**且工作区**也有变更** → 提示用户「暂存区和工作区均有变更」，询问是全部暂存后提交，还是仅提交暂存区内容，然后根据选择决定 diff 来源
- 暂存区为空但工作区**有变更或未跟踪文件** → 步骤 3 使用 `mcp3_git_diff_unstaged`
- **两者都为空** → 提示用户「当前没有可提交的变更」并终止流程

## 步骤 3：读取完整 diff

根据步骤 2 判断结果，使用对应的 git MCP 工具读取 diff：

**暂存区有内容时：**

```tool
mcp3_git_diff_staged(repo_path=REPO_PATH)
```

**工作区变更时：**

```tool
mcp3_git_diff_unstaged(repo_path=REPO_PATH)
```

## 步骤 4：生成 Commit Message

根据 diff 内容，按 **Conventional Commits** 规范生成 commit message。

格式：

```text
<type>(<scope>): <简短描述>

<详细说明（可选，当改动较复杂时提供）>
```

**type 取值：**

| type     | 含义                           |
| -------- | ------------------------------ |
| feat     | 新功能                         |
| fix      | 修复 Bug                       |
| docs     | 文档变更                       |
| style    | 代码格式调整（不影响逻辑）     |
| refactor | 重构（既不是新功能也不是修复） |
| perf     | 性能优化                       |
| test     | 测试相关                       |
| chore    | 构建/工具/依赖变更             |

**规则：**

- **scope** 取受影响的模块或页面名，如 `pages/home`、`components/navbar`、`utils`
- 描述使用中文，简短描述不超过 50 字符
- 多种类型改动时，按主要改动选 type，详细说明中列出其他改动
- 改动很小且单一时可省略详细说明
- **原子提交**：每个 commit 只做一件事，可独立回滚。如果变更涉及多个不相关改动，建议拆分为多次提交

## 步骤 5：确认并提交

将生成的 commit message 展示给用户，询问：

> 是否要执行提交？
>
> - **提交** — 暂存所有变更文件并提交
> - **仅暂存区提交** — 只提交已暂存的内容
> - **修改** — 用户提供修改意见，重新生成
> - 用户也可以直接输入自定义回复

根据用户选择，使用 git MCP 工具执行：

- 选择「提交」：暂存变更文件（精确路径），再提交

```tool
mcp3_git_add(repo_path=REPO_PATH, files=["file1", "file2", ...])
mcp3_git_commit(repo_path=REPO_PATH, message="<message>")
```

- 选择「仅暂存区提交」：直接提交

```tool
mcp3_git_commit(repo_path=REPO_PATH, message="<message>")
```

- 选择「修改」：根据用户反馈调整 message 后重新回到步骤 4。

## 步骤 6：拉取远程最新代码

提交成功后，先同步远程信息并拉取最新代码（`cwd` 设为 `REPO_PATH`）：

// turbo

```bash
git fetch origin
```

// turbo

```bash
git pull --rebase
```

- 如果拉取成功且无冲突，继续步骤 8。
- 如果出现冲突，进入步骤 7。

## 步骤 7：处理冲突

如果 `git pull --rebase` 产生冲突：

1. 运行 `git diff --name-only --diff-filter=U` 列出冲突文件。
1. 展示冲突文件列表给用户，提示用户手动解决冲突。
1. 等待用户确认冲突已解决后，执行 `git add -A && git rebase --continue`。
1. 如果用户希望放弃本次 rebase，执行 `git rebase --abort` 并终止流程。

## 步骤 8：推送到远程

询问用户是否推送到远程仓库：

> 是否要推送到远程？
>
> - **推送** — 推送当前分支到远程（`git push`）
> - **强制推送** — rebase 后安全推送（`git push --force-with-lease`）
> - **推送并设置上游** — 首次推送新分支（`git push -u origin <branch>`）
> - **跳过** — 不推送

根据用户选择执行对应命令：

- 选择「推送」：

// turbo

```bash
git push
```

- 选择「强制推送」（仅限 rebase 后自己的功能分支，禁止在共享分支使用）：

// turbo

```bash
git push --force-with-lease
```

- 选择「推送并设置上游」：

// turbo

```bash
git push -u origin $(git branch --show-current)
```

- 选择「跳过」：结束流程。
