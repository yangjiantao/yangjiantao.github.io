# 应用公开地址规范

新应用统一使用：

- 应用主页：`https://shanmeii.cn/projects/<应用标识>/`
- 隐私政策：`https://shanmeii.cn/projects/<应用标识>/privacy/`

## PandaDoku

- 应用名称：pandadoku（熊猫数独）
- 应用主页：https://shanmeii.cn/projects/pandadoku/
- 隐私政策：https://shanmeii.cn/projects/pandadoku/privacy/
- 网站首页、产品页、页脚和 404 页均链接到上述隐私政策。
- 旧 `/pandadoku/privacy/` 保留静态 HTML 跳转和可点击链接。GitHub Pages 不提供逐路径服务器重定向配置，因此这里使用 meta refresh，而非 HTTP 301。
- 政策正文保持已审核版本，SHA-256 继续由构建验证脚本校验。

## OAuth 品牌配置

在 Google Auth Platform 的 Branding 页面使用：

| 字段 | 值 |
| --- | --- |
| Application home page | https://shanmeii.cn/projects/pandadoku/ |
| Application privacy policy link | https://shanmeii.cn/projects/pandadoku/privacy/ |
| Authorized domains | shanmeii.cn |

以上是品牌展示地址；OAuth 回调 URI 按实际登录集成配置，不以应用主页替换。
本仓库不包含 Google 控制台配置；网站部署不会自动更改 OAuth 品牌字段。

## 审核回复邮件模板

Hello Google Review Team,

The custom domain has been connected successfully. The public pages for pandadoku are:

- Application homepage: https://shanmeii.cn/projects/pandadoku/
- Privacy policy: https://shanmeii.cn/projects/pandadoku/privacy/

Both pages are publicly accessible over HTTPS without signing in. The application homepage includes a direct link to the privacy policy.

Thank you.

此文件仅提供回复模板，未发送邮件。品牌配置实际保存后，可在回复中补充其已更新的确认。
