# shanmeii.cn 接入 GitHub Pages

## 当前状态（2026-10-25）

- 用户确认域名：`shanmeii.cn`（不是之前文字中的 `shanmem.cn`）。
- 用户已完成 GitHub 域名验证及全部 DNS 配置。实测根域名四条 A 及 www CNAME 正确，远端 master 的 CNAME 为 shanmeii.cn；HTTPS 证书尚待签发验收。
- 方案：沿用 GitHub Pages 海外托管，暂不部署中国内地服务器或 CDN；不主动限制国内用户访问。
- 源码分支：`codex/personal-studio`；生成站点发布分支：`master`，目录 `/`。
- 用户已要求继续接入；本次同步远端最新源码后发布，HTTPS 及最终访问状态单独验收。

## 审核通过后的操作顺序

1. 确认注册局审核和实名认证通过，域名已可正常解析。
2. 打开 https://github.com/settings/pages ，Add a domain 输入 `shanmeii.cn`。
3. 根据 GitHub 实际给出的值，在阿里云添加 TXT。主机记录通常为 `_github-pages-challenge-yangjiantao`，阿里云自动拼接主域名，不重复填写。记录值复制 GitHub 验证码。点击 GitHub Verify，成功后保留 TXT。
4. 检查并提交本次源码改动。现有 `output/` 为用户原有本地文件，已通过 `.git/info/exclude` 中的 `/output/` 保留并仅在本机忽略，不删除、不混入源码或发布。
5. 执行 `npm run deploy`：构建并校验，推送源码与生成的 `master`。生成目录根部的 CNAME 将配置 Pages 自定义域名；确认仓库 Settings → Pages → Custom domain 为 `shanmeii.cn`。如自动配置尚未显示，在此保存该域名。域名切换与 DNS 应在同一操作窗口完成，避免旧地址跳转到尚未就绪的新地址。
6. 添加下表网站 DNS；核实冲突后替换原有停放页记录，不删除邮箱及域名验证记录。不配置泛解析或 URL 转发。
7. 等待 DNS 检查与证书签发通过，勾选 Enforce HTTPS。最多可能需要 24 小时。

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | yangjiantao.github.io |

解析线路使用默认，TTL 10 分钟。CNAME 值不加协议或路径。TXT 的值必须从账号设置中获取，不能预先推测。

## 验收

- `npm run verify`：类型检查、构建、CNAME 与站点域名一致、canonical 域名、站内链接和锚点、隐私政策校验和。
- DNS：`dig +short shanmeii.cn A`，`dig +short www.shanmeii.cn CNAME`。
- 检查 HTTPS 有效证书及主域名首页返回成功；www 自动跳转主域名。
- 检查 `/projects/pandadoku/`、`/pandadoku/privacy/`、`/app-ads.txt`、`/google079d94aae576d184.html`。
- 从境外网络检查页面、图片、字体；旧 github.io 隐私地址也需检查跳转及路径保留。
- 验收通过后另行更新 Google Play、AdMob、Search Console 等服务中的网站地址；本次不修改这些外部配置。

## 官方参考

- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://help.aliyun.com/zh/dns/pubz-add-parsing-record

## 本地准备验收记录

- 目录：`/Users/jiantaoyang/codeRepo/yangjiantao.github.io`。
- 基线提交：`d0ef3897c86ab35c88d812d02a35e6683ea6cb1e`。
- 2026-10-25：`npm run verify` 通过；Astro 检查 12 个文件，0 错误、0 警告。
- 静态构建及站内链接、锚点、隐私政策校验和检查通过；构建 CNAME 与站点域名一致。
- 未提交、未推送、未发布；DNS、GitHub 域名验证及线上 HTTPS 待审核通过后执行。

- 后续接入：已同步远端基线 `21945fa110b639133f54b835fea128c8643d833f`，保留最新隐私政策、Google 验证文件和产品说明检查。
