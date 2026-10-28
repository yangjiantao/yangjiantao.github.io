# PandaDoku 正式下载入口（2026-10-28）

- 用户授权执行运营方案第 1 项：补齐官网下载按钮，统一宣传直接商店入口。
- 官网源码基线：85342c1，沿用 codex/personal-studio；远端源码未出现新增提交，原部署 master 为 dafde70。
- 单一下载地址：https://play.google.com/store/apps/details?id=com.shanmei.pandadoku 。源码由 src/data/pandadoku.ts 维护，复用 GooglePlayDownload 组件。
- 网站首页项目卡、产品页首屏及页尾共三个按钮均直接进入指定商店详情页；展示完整英文名与公开开发者 shanmei。
- 用户后续明确要求按新增地区已审核通过的背景优化文案。中英文采用“已在 Google Play 正式上线，支持多个国家和地区下载；具体可用性以商店显示为准”，去掉马新限定及审核中提示。本条记录文案依据，不声明本轮重新核验了 Play 审核状态。
- 工作室资料同步统一入口及中英文复制文案、P04 待制作稿、待发布公众号 Markdown/纯文本稿；已发布视频及既有 YouTube 简介原文不变。
- 验证：npm run verify 通过，Astro 0 errors / warnings / hints；静态构建、指定包名链接、站内路由、隐私政策哈希和 Google 验证文件通过。内嵌浏览器首屏视觉检查及实际 href 回读通过。
- 隐私政策、DNS、CNAME、app-ads.txt 与应用包保持原状；不为下载强制注册或添加报名表。
- 发布通过既有 npm run deploy 流程；线上回读与部署结果后续补记。
