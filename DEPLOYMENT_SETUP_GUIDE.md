# 🚀 Cloudflare Pages 配置指南 - 分步操作

> **目标**: 完成从手动上传到 Git 自动部署的迁移
> **预计时间**: 10-15 分钟
> **难度**: ⭐⭐☆☆☆ (初级)

---

## 📋 准备工作检查

在开始之前，请确保你拥有：

- [x] GitHub 账号登录状态
- [x] Cloudflare 账号登录状态
- [x] 域名: toolsapplab.com 已在 Cloudflare
- [x] 代码已推送到 GitHub

---

## 🔐 步骤 1: 获取 Cloudflare API Token

### 1.1 访问 API Tokens 页面

```
🔗 直接链接: https://dash.cloudflare.com/profile/api-tokens

或者:
1. 登录 Cloudflare Dashboard
2. 点击右上角头像
3. 选择 "我的个人资料"
4. 左侧菜单选择 "API Tokens"
```

### 1.2 创建新 Token

```
1. 点击 "创建令牌" 按钮
2. 找到 "Cloudflare Pages" 模板
3. 点击右侧的 "使用模板" 按钮
```

### 1.3 配置 Token 权限

你会看到一个配置表单，按以下设置：

```
权限 (Permissions):
─────────────────────────────────────────
Account  │  Cloudflare Pages  │  Edit
─────────────────────────────────────────
Account  │  Account Settings │  Read
─────────────────────────────────────────

Zone (可选 - 用于自定义域名):
─────────────────────────────────────────
Zone     │  Zone             │  Read
─────────────────────────────────────────

Zone Resources:
─────────────────────────────────────────
Include  │  All zones
─────────────────────────────────────────

TTL:
─────────────────────────────────────────
☐ 令牌将过期 (不要勾选，保持永久有效)
─────────────────────────────────────────

客户端 IP 地址限制 (可选):
─────────────────────────────────────────
留空 (除非你需要 IP 白名单)
─────────────────────────────────────────
```

### 1.4 继续创建

```
1. 点击 "继续以显示摘要"
2. 检查配置是否正确
3. 点击 "创建令牌"
4. ⚠️ 重要: 立即复制 Token！
   （只显示一次，请妥善保管）
```

### 1.5 保存 Token

```
将 Token 复制并保存到安全的地方，格式类似:
eyJ4ZXA6xxxxx... (很长的字符串)
```

---

## 🔑 步骤 2: 获取 Cloudflare Account ID

### 2.1 在 Dashboard 找到 Account ID

```
方式 1 - 推荐:
─────────────────────────────────────────
1. 访问: https://dash.cloudflare.com
2. 在右侧边栏可以看到 "Account ID"
3. 点击右侧的复制按钮

方式 2:
─────────────────────────────────────────
1. 任意进入一个域名详情页
2. 右上角可以看到 Account ID
3. 点击复制
```

### 2.2 保存 Account ID

```
Account ID 格式类似:
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
(32 位十六进制字符串)
```

---

## 🔧 步骤 3: 配置 GitHub Secrets

### 3.1 打开 GitHub Secrets 设置页面

```
🔗 直接链接:
https://github.com/ligou4318-spec/it-tools/settings/secrets/actions

或者手动导航:
1. 访问: https://github.com/ligou4318-spec/it-tools
2. 点击顶部 "Settings" 标签
3. 左侧菜单选择 "Secrets and variables" -> "Actions"
4. 你会看到 "Repository secrets" 部分
```

### 3.2 添加第一个 Secret: CLOUDFLARE_API_TOKEN

```
1. 点击 "New repository secret" 按钮
2. 填写表单:

   Name* (必填):
   ┌─────────────────────────────────────┐
   │ CLOUDFLARE_API_TOKEN                │
   └─────────────────────────────────────┘

   Secret* (必填):
   ┌─────────────────────────────────────┐
   │ 粘贴你在步骤 1.4 复制的 API Token   │
   │                                     │
   │ (粘贴后点击 "Add secret" 按钮)      │
   └─────────────────────────────────────┘

3. 点击 "Add secret" 确认添加
```

### 3.3 添加第二个 Secret: CLOUDFLARE_ACCOUNT_ID

```
1. 再次点击 "New repository secret" 按钮
2. 填写表单:

   Name* (必填):
   ┌─────────────────────────────────────┐
   │ CLOUDFLARE_ACCOUNT_ID               │
   └─────────────────────────────────────┘

   Secret* (必填):
   ┌─────────────────────────────────────┐
   │ 粘贴你在步骤 2.2 复制的 Account ID  │
   │                                     │
   │ (32位字符串)                        │
   └─────────────────────────────────────┘

3. 点击 "Add secret" 确认添加
```

### 3.4 验证 Secrets 已添加

```
你应该看到两个 Secrets 在列表中:
✅ CLOUDFLARE_API_TOKEN     (Added X time ago)
✅ CLOUDFLARE_ACCOUNT_ID    (Added X time ago)

注意:
- Secret 值不会显示，这是正常的
- 你可以点击 "Update" 更新 Secret
- 你可以点击 "Remove" 删除并重新添加
```

---

## 🔗 步骤 4: 连接 Cloudflare Pages 到 GitHub

### 方式 A: 通过 Cloudflare Dashboard (推荐 ⭐)

### 4.1 访问 Cloudflare Pages

```
🔗 直接链接:
https://dash.cloudflare.com/

或者:
1. 登录 Cloudflare Dashboard
2. 左侧菜单点击 "Pages"
```

### 4.2 创建新项目

```
1. 点击 "创建项目" 按钮
2. 选择 "连接到 Git" 选项卡
3. 点击 "连接到 GitHub" 按钮
```

### 4.3 授权 Cloudflare 访问 GitHub

```
如果第一次使用:
1. 会跳转到 GitHub 授权页面
2. 点击 "Authorize Cloudflare" 授权
3. 选择 "All repositories" 或 "Only select repositories"
4. 如果选择 "Only select repositories":
   - 搜索并选择: ligou4318-spec/it-tools
5. 点击 "Install & Authorize"
```

### 4.4 选择仓库

```
在 Cloudflare Pages 页面:
1. 你会看到仓库列表
2. 找到并选择: ligou4318-spec/it-tools
3. 点击 "开始设置" 按钮
```

### 4.5 配置构建设置

```
填写以下信息:

项目名称:
┌─────────────────────────────────────┐
│ it-tools                            │
└─────────────────────────────────────┘

生产分支:
┌─────────────────────────────────────┐
│ main                                │
└─────────────────────────────────────┘

构建命令:
┌─────────────────────────────────────┐
│ pnpm run build:cf                   │
└─────────────────────────────────────┘

构建输出目录:
┌─────────────────────────────────────┐
│ dist                                │
└─────────────────────────────────────┘

环境变量 (可选 - 高级):
┌─────────────────────────────────────┐
│ NODE_VERSION = 22                   │
│ PNPM_VERSION = 9.11.0               │
└─────────────────────────────────────┘
```

### 4.6 保存并部署

```
1. 检查所有配置是否正确
2. 点击 "保存并部署" 按钮
3. ⏳ Cloudflare 会自动:
   - 从 GitHub 克隆代码
   - 运行构建命令
   - 部署到全球 CDN
4. 等待首次部署完成 (约 2-3 分钟)
```

### 4.7 首次部署完成

```
你会看到:
✅ 部署成功
🔗 部署 URL: https://it-tools.pages.dev
📊 部署时间: 约 2-3 分钟

点击部署 URL 验证网站是否正常运行
```

---

## 🌐 步骤 5: 配置自定义域名

### 5.1 添加自定义域名

```
在 Cloudflare Pages 项目页面:
1. 点击 "自定义域" 标签
2. 点击 "设置自定义域" 按钮
```

### 5.2 输入域名

```
┌─────────────────────────────────────┐
│ toolsapplab.com                     │
└─────────────────────────────────────┘

点击 "继续" 按钮
```

### 5.3 验证 DNS

```
Cloudflare 会自动:
1. 检查域名的 DNS 记录
2. 如果域名已在 Cloudflare:
   ✅ 会自动添加 CNAME 记录
   ✅ 会自动配置 SSL 证书
3. 如果域名在其他地方:
   ❌ 需要手动添加 DNS 记录
```

### 5.4 激活域名

```
1. 等待 DNS 传播 (通常几分钟)
2. 状态变为 "Active"
3. SSL 证书自动生成 (Let's Encrypt)
```

### 5.5 最终验证

```
访问以下 URL 验证:
- https://toolsapplab.com (主域名)
- https://www.toolsapplab.com (www 子域名)

应该看到你的网站正常显示
```

---

## ✅ 步骤 6: 验证自动部署

### 6.1 触发测试部署

```bash
# 在本地创建一个小的测试更改
git pull origin main
echo "# Test Deployment" >> README.md
git add README.md
git commit -m "test: Verify automatic deployment"
git push origin main
```

### 6.2 监控部署过程

```
1. 打开 GitHub Actions:
   https://github.com/ligou4318-spec/it-tools/actions

2. 你会看到工作流自动运行:
   "Deploy to Cloudflare Pages"

3. 点击进入查看详细日志

4. 等待工作流完成 (约 2-3 分钟)
```

### 6.3 验证部署结果

```
✅ 工作流状态显示绿色勾 (✓)
✅ Cloudflare Pages 显示新部署
✅ 网站更新成功
```

---

## 🎯 配置完成检查清单

完成以下所有项后，你的自动部署就完全配置好了：

### GitHub Secrets
- [ ] ✅ CLOUDFLARE_API_TOKEN 已添加
- [ ] ✅ CLOUDFLARE_ACCOUNT_ID 已添加
- [ ] ✅ Secrets 名称完全匹配 (区分大小写)

### Cloudflare Pages
- [ ] ✅ 项目已创建: it-tools
- [ ] ✅ GitHub 仓库已连接
- [ ] ✅ 构建命令: pnpm run build:cf
- [ ] ✅ 构建目录: dist
- [ ] ✅ 首次部署成功
- [ ] ✅ 自定义域名已配置: toolsapplab.com

### 自动部署
- [ ] ✅ 推送到 main 触发部署
- [ ] ✅ GitHub Actions 运行成功
- [ ] ✅ Cloudflare Pages 自动更新
- [ ] ✅ 网站访问正常

---

## 🔍 故障排查

### 问题 1: GitHub Actions 报错 "Invalid API Token"

**解决方案**:
```
1. 检查 Secret 名称: CLOUDFLARE_API_TOKEN
   (必须是这个名字，区分大小写)

2. 重新生成 API Token 并更新 Secret:
   - 删除现有 Secret
   - 重新创建 Token
   - 重新添加 Secret

3. 确认 Token 权限:
   - Account: Cloudflare Pages: Edit
   - Zone: Zone: Read (如果使用自定义域名)
```

### 问题 2: Cloudflare Pages 找不到仓库

**解决方案**:
```
1. 检查 GitHub 授权状态:
   - Cloudflare Dashboard -> Workers & Pages
   - 点击 "Connect to GitHub"
   - 重新授权

2. 确认仓库是公开的或已授权访问

3. 检查仓库是否在正确的 GitHub 账户下
```

### 问题 3: 构建失败

**解决方案**:
```
1. 在本地测试构建:
   pnpm install
   pnpm run build:cf

2. 检查 Node.js 版本:
   node --version  # 应该是 v22+

3. 检查 pnpm 版本:
   pnpm --version  # 应该是 9.11.0+

4. 查看 Cloudflare 构建日志:
   - 打开 Pages 项目
   - 点击失败的部署
   - 查看详细错误信息
```

### 问题 4: 自定义域名无法访问

**解决方案**:
```
1. 检查 DNS 记录:
   - Cloudflare Dashboard -> DNS
   - 确认 CNAME 或 A 记录存在

2. 检查 SSL 证书:
   - Cloudflare Dashboard -> SSL/TLS
   - 确认证书状态为 "Active"

3. 等待 DNS 传播:
   - 最多需要 24-48 小时
   - 通常只需要几分钟
```

---

## 📞 需要帮助？

如果遇到问题:

1. **查看日志**:
   - GitHub Actions: https://github.com/ligou4318-spec/it-tools/actions
   - Cloudflare Pages: https://dash.cloudflare.com

2. **查看文档**:
   - CLOUDFLARE_DEPLOYMENT.md

3. **检查配置**:
   - wrangler.toml
   - .github/workflows/cloudflare-pages.yml

---

## 🎉 完成后的效果

配置完成后，你将拥有:

✅ **自动部署**: 每次推送到 main 分支自动触发
✅ **预览环境**: 每次 PR 自动创建预览 URL
✅ **全球 CDN**: 300+ 边缘节点
✅ **零停机**: 滚动更新策略
✅ **企业级安全**: OWASP 标准安全头部
✅ **性能优化**: 自动压缩和缓存

---

**开始配置吧！按顺序完成每个步骤，有问题随时问我。** 🚀
