# PandaDoku 隐私政策同步（2026-10-28）

- 网站源码基线：384b408（codex/personal-studio）；对照游戏 main e1208f6 中已合并的统计开关、登录诊断和正式广告配置。
- 公开地址保持 https://shanmeii.cn/projects/pandadoku/privacy/ ，不修改 DNS、CNAME、app-ads.txt、Google 验证文件或外部后台表单。
- 中英文均更新：区分已分发 0.1.11 封测无开关与提供开关的新版；明确默认开启、可关闭/重开、选择仅本机保存及停止采集不等于删除历史数据。
- 补充 Analytics 普通事件 2 个月、用户 14 个月、关键事件适用用户期限、新活动重置用户期限、标准汇总报告不受此设置影响。该设置不代表广告、云存档和导出数据的期限。
- 保留云存档、身份及显示名称用途、奖励和广告处理说明；新增登录诊断不包含玩家身份/名称/令牌的说明。不承诺全部服务端数据在 90 天内删除。
- 自审：未将尚未分发的统计开关写成所有现有版本都可用；未将 Play Games 已发布等同于新应用版本已发布；未扩大已核实的数据删除能力。
- npm run verify 通过：Astro 类型检查、静态构建、路由/站内链接/锚点、政策校验和、原 Google 验证文件及域名一致性。浏览器桌面预览检查中文和英文日期、保留段落可读。
- 对比 origin/master 与 dist 的全部文件：仅 projects/pandadoku/privacy/index.html 内容变化。同步更新了现有构建校验中的政策校验和与必要披露检查。
- 政策 SHA-256：0ad3b35370f0a1f7b388173c0514a686568b1be976135f9800ae6608160a9e11。
- 用户明确授权“完成部署，发布上线”后，通过 npm run deploy 发布。
- 发布源码提交：d208af0c9db484b8ad0133caacc06e8e1c36e3c1（codex/personal-studio）；生成站点提交：dafde707b6e391bd71fd3f3f9360b5fdc3ac8964（master）。
- GitHub Pages 部署 completed / success：https://github.com/yangjiantao/yangjiantao.github.io/actions/runs/40621305357 。
- 对原始无查询参数的 https://shanmeii.cn/projects/pandadoku/privacy/ 执行 HTTPS 回读，HTTP 200，完整文件哈希与已审阅的源码一致；中文及英文日期均为 2026-10-28，统计开关和保留设置说明已生效。
- 本次只发布开发者网站隐私政策；未修改游戏仓库远端、Play 后台、PGS 配置，也未构建或发布游戏 AAB。
- 本次追加的部署结果记录仅本地提交，不额外推送网站源码分支；不影响已完成的页面发布。
