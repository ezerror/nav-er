// 导航数据配置
export const navData = {
  mainCategories: [
    {
      id: 'dev-tools',
      name: '开发工具',
      icon: 'Code',
      description: '开发环境、测试、生产环境相关工具',
      color: 'bg-blue-500'
    },
    {
      id: 'team-collab',
      name: '团队协作',
      icon: 'Users',
      description: '团队沟通、文档协作、项目管理工具',
      color: 'bg-green-500'
    }
  ],
  devLinks: [
    {
      category: "开发环境",
      mainCategory: "dev-tools",
      icon: "Code",
      color: 'bg-blue-100 text-blue-800',
      links: [
        { name: "本地开发地址", url: "http://localhost:3000" },
        { name: "开发服务器", url: "http://dev.example.com" },
        { name: "API文档", url: "http://api-docs.example.com" },
        { name: "GraphQL Playground", url: "http://localhost:4000/graphql" },
        { name: "组件库文档", url: "http://storybook.example.com" }
      ]
    },
    {
      category: "测试环境",
      mainCategory: "dev-tools",
      icon: "TestTube",
      color: 'bg-purple-100 text-purple-800',
      links: [
        { name: "测试环境地址", url: "http://test.example.com" },
        { name: "自动化测试报告", url: "http://test-reports.example.com" },
        { name: "性能测试平台", url: "http://perf-test.example.com" },
        { name: "UI测试工具", url: "http://cypress.example.com" },
        { name: "单元测试覆盖率", url: "http://coverage.example.com" }
      ]
    },
    {
      category: "生产环境",
      mainCategory: "dev-tools",
      icon: "Server",
      color: 'bg-red-100 text-red-800',
      links: [
        { name: "生产环境地址", url: "https://example.com" },
        { name: "监控平台", url: "https://monitoring.example.com" },
        { name: "日志平台", url: "https://logs.example.com" },
        { name: "错误追踪系统", url: "https://sentry.example.com" },
        { name: "CDN管理", url: "https://cdn.example.com" }
      ]
    },
    {
      category: "工具平台",
      mainCategory: "dev-tools",
      icon: "Wrench",
      color: 'bg-yellow-100 text-yellow-800',
      links: [
        { name: "代码仓库", url: "https://github.com/company/project" },
        { name: "CI/CD平台", url: "https://jenkins.example.com" },
        { name: "项目管理", url: "https://jira.example.com" },
        { name: "代码审查", url: "https://review.example.com" },
        { name: "设计系统", url: "https://design.example.com" }
      ]
    },
    {
      category: "数据库服务",
      mainCategory: "dev-tools",
      icon: "Database",
      color: 'bg-indigo-100 text-indigo-800',
      links: [
        { name: "主数据库", url: "https://db-main.example.com" },
        { name: "只读副本", url: "https://db-readonly.example.com" },
        { name: "缓存系统", url: "https://redis.example.com" },
        { name: "消息队列", url: "https://mq.example.com" },
        { name: "数据仓库", url: "https://warehouse.example.com" }
      ]
    },
    {
      category: "数据分析",
      mainCategory: "dev-tools",
      icon: "BarChart",
      color: 'bg-teal-100 text-teal-800',
      links: [
        { name: "数据看板", url: "https://dashboard.example.com" },
        { name: "BI平台", url: "https://bi.example.com" },
        { name: "用户行为分析", url: "https://analytics.example.com" },
        { name: "A/B测试平台", url: "https://abtest.example.com" },
        { name: "业务指标监控", url: "https://metrics.example.com" }
      ]
    },
    {
      category: "安全合规",
      mainCategory: "dev-tools",
      icon: "Shield",
      color: 'bg-pink-100 text-pink-800',
      links: [
        { name: "安全扫描", url: "https://security.example.com" },
        { name: "权限管理", url: "https://iam.example.com" },
        { name: "审计日志", url: "https://audit.example.com" },
        { name: "漏洞管理", url: "https://vuln.example.com" },
        { name: "合规文档", url: "https://compliance.example.com" }
      ]
    },
    {
      category: "版本控制",
      mainCategory: "dev-tools",
      icon: "GitBranch",
      color: 'bg-gray-100 text-gray-800',
      links: [
        { name: "主分支", url: "https://github.com/company/project/tree/main" },
        { name: "发布分支", url: "https://github.com/company/project/releases" },
        { name: "代码提交历史", url: "https://github.com/company/project/commits" },
        { name: "合并请求", url: "https://github.com/company/project/pulls" },
        { name: "代码标签", url: "https://github.com/company/project/tags" }
      ]
    },
    {
      category: "文档资源",
      mainCategory: "team-collab",
      icon: "FileText",
      color: 'bg-orange-100 text-orange-800',
      links: [
        { name: "技术文档", url: "https://docs.example.com" },
        { name: "API参考", url: "https://api-docs.example.com" },
        { name: "部署手册", url: "https://deploy.example.com" },
        { name: "运维手册", url: "https://ops.example.com" },
        { name: "知识库", url: "https://wiki.example.com" }
      ]
    },
    {
      category: "团队协作",
      mainCategory: "team-collab",
      icon: "Users",
      color: 'bg-green-100 text-green-800',
      links: [
        { name: "团队通讯", url: "https://slack.example.com" },
        { name: "视频会议", url: "https://zoom.example.com" },
        { name: "文档协作", url: "https://docs.google.com" },
        { name: "设计协作", url: "https://figma.example.com" },
        { name: "任务看板", url: "https://trello.example.com" }
      ]
    },
    {
      category: "日程管理",
      mainCategory: "team-collab",
      icon: "Calendar",
      color: 'bg-cyan-100 text-cyan-800',
      links: [
        { name: "项目日历", url: "https://calendar.example.com" },
        { name: "发布计划", url: "https://releases.example.com" },
        { name: "会议预约", url: "https://meetings.example.com" },
        { name: "里程碑", url: "https://milestones.example.com" },
        { name: "假期安排", url: "https://pto.example.com" }
      ]
    }
  ]
};
