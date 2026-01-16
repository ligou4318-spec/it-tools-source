# 监控与健康检查配置指南
# Monitoring & Health Check Setup Guide

> **目标**: 实现自动化监控，确保 toolsapplab.com 99.9%+ 可用性
> **Target**: Automated monitoring for 99.9%+ uptime

---

## 目录

1. [内置监控 (GitHub Actions)](#1-内置监控-github-actions)
2. [外部监控服务](#2-外部监控服务)
3. [告警配置](#3-告警配置)
4. [性能监控](#4-性能监控)
5. [手动验证](#5-手动验证)

---

## 1. 内置监控 (GitHub Actions)

### 已启用的工作流

项目已配置 `.github/workflows/health-check.yml`，每小时自动运行：

| 检查项 | 说明 |
|--------|------|
| 🟢 可用性检查 | 验证主域名和 www 子域名可访问 |
| 🔒 SSL 证书检查 | 验证 HTTPS 证书有效期 |
| 📄 内容验证 | 检查关键页面元素 |
| 🔐 安全头部 | 验证安全最佳实践 |
| ⚡ 性能检查 | 测量 TTFB 和响应时间 |

### 查看监控结果

```
https://github.com/ligou4318-spec/it-tools/actions/workflows/health-check.yml
```

---

## 2. 外部监控服务

### 选项 1: UptimeRobot (推荐 - 免费)

1. **注册账号**
   - 访问: https://uptimerobot.com
   - 注册免费账号

2. **添加监控器**
   ```
   Monitor Type: HTTPS
   URL: https://toolsapplab.com
   Check Interval: 5 minutes
   Alert: Email + Slack (optional)
   ```

3. **添加额外监控**
   - https://www.toolsapplab.com
   - https://toolsapplab.com/manifest.webmanifest

### 选项 2: Pingdom

1. **注册账号**
   - 访问: https://www.pingdom.com
   - 免费层支持 1 个监控器

2. **配置 Uptime 监控**
   ```
   URL: https://toolsapplab.com
   Region: US West
   Check interval: 1 minute
   Alerts: Email
   ```

### 选项 3: Checkly (代码驱动)

1. **注册账号**
   - 访问: https://checklyhq.com
   - 支持 API 监控和浏览器检查

2. **创建检查**
   ```javascript
   // 示例: 检查首页
   const assert = require('assert');

   const response = await playwright.goto('https://toolsapplab.com');
   assert.strictEqual(response.status(), 200);

   await playwright.waitForSelector('#app');
   ```

---

## 3. 告警配置

### Slack 集成

#### 在 GitHub Actions 中添加 Slack 通知

1. **创建 Slack Webhook**
   ```
   Slack App → Incoming Webhooks
   创建新 Webhook → 复制 URL
   ```

2. **添加 GitHub Secret**
   ```
   Name: SLACK_WEBHOOK_URL
   Value: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

3. **更新 health-check.yml**
   ```yaml
   - name: 📢 Notify Slack on Failure
     if: failure()
     run: |
       curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
         -H 'Content-Type: application/json' \
         -d '{"text": "🚨 Health check failed for toolsapplab.com"}'
   ```

### Email 告警

- GitHub Actions 默认向 workflow 触发者发送失败邮件
- 配置仓库设置 → Notifications → Email

---

## 4. 性能监控

### Core Web Vitals

| 指标 | 目标 | 监控工具 |
|------|------|----------|
| LCP (Largest Contentful Paint) | < 2.5s | PageSpeed Insights |
| FID (First Input Delay) | < 100ms | PageSpeed Insights |
| CLS (Cumulative Layout Shift) | < 0.1 | PageSpeed Insights |
| TTFB (Time to First Byte) | < 200ms | curl / WebPageTest |

### 监控工具

#### PageSpeed Insights (Google)
```
https://pagespeed.web.dev/?url=https://toolsapplab.com
```

#### WebPageTest
```
1. 访问: https://www.webpagetest.org
2. 输入 URL: https://toolsapplab.com
3. 测试位置: US East, US West, Europe
4. 运行测试
```

#### Chrome DevTools
```
1. 访问 https://toolsapplab.com
2. F12 打开 DevTools
3. Lighthouse 标签
4. 分析页面加载
```

---

## 5. 手动验证

### 快速健康检查

```bash
# 检查 HTTP 状态码
curl -I https://toolsapplab.com

# 检查响应时间
curl -o /dev/null -s -w "Time: %{time_total}s\n" https://toolsapplab.com

# 检查 SSL 证书
echo | openssl s_client -servername toolsapplab.com -connect toolsapplab.com:443 2>/dev/null | openssl x509 -noout -dates

# 检查安全头部
curl -I https://toolsapplab.com | grep -E "X-Content|X-Frame|Strict-Transport"
```

### DNS 验证

```bash
# 检查 DNS 解析
dig toolsapplab.com

# 检查 IPv6
dig AAAA toolsapplab.com

# 检查 WHOIS
whois toolsapplab.com
```

### HTTP/3 验证

```bash
# 检查 HTTP/3 支持
curl -I https://toolsapplab.com

# 查找响应头中的:
# alt-svc: h3=":443"; ma=86400
```

---

## 6. 监控仪表板

### Cloudflare Analytics

```
https://dash.cloudflare.com → Pages → it-tools → Analytics
```

可用指标:
- 请求量
- 带宽使用
- 缓存命中率
- 地理分布
- 设备类型

### GitHub Actions Summary

每次运行后，在 Actions 页面查看详细摘要：

```
https://github.com/ligou4318-spec/it-tools/actions/workflows/health-check.yml
```

---

## 7. 告警阈值

| 指标 | 警告 | 严重 | 操作 |
|------|------|------|------|
| 可用性 | < 99.9% | < 99% | 立即调查 |
| TTFB | > 500ms | > 1s | 检查 CDN |
| 错误率 | > 1% | > 5% | 查看日志 |
| SSL 过期 | < 30天 | < 7天 | 更新证书 |

---

## 8. 故障响应流程

### P0 - 严重故障 (网站不可访问)

1. **立即确认**
   ```bash
   curl -I https://toolsapplab.com
   ```

2. **检查 Cloudflare 状态**
   ```
   https://www.cloudflarestatus.com
   ```

3. **检查 GitHub Actions**
   ```
   https://github.com/ligou4318-spec/it-tools/actions
   ```

4. **回滚部署**
   - Cloudflare Pages → Deployments → Rollback
   - 或: `git revert HEAD && git push`

5. **通知团队**
   - 创建 GitHub Issue
   - 发送 Slack 消息

### P1 - 性能下降

1. **运行 PageSpeed Insights**
2. **检查 Cloudflare 缓存命中率**
3. **查看 Cloudflare Analytics**
4. **优化构建包大小**

### P2 - SSL 证书即将过期

1. **确认过期时间**
2. **Cloudflare 会自动续期 Let's Encrypt**
3. **如 < 7天，联系 Cloudflare 支持**

---

## 9. 监控检查清单

- [ ] GitHub Actions health-check 已启用
- [ ] 外部 Uptime 监控已配置 (UptimeRobot/Pingdom)
- [ ] Slack/Email 告警已配置
- [ ] PageSpeed Insights 已添加书签
- [ ] WebPageTest 已配置测试
- [ ] Cloudflare Analytics 定期查看
- [ ] 故障响应流程已文档化

---

**下一步**: 配置外部监控服务并设置告警
**文档版本**: v1.0.0
**最后更新**: 2025-01-17
