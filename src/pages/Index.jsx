import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Users, 
  TestTube, 
  Server, 
  Wrench, 
  Database, 
  BarChart, 
  Shield, 
  GitBranch, 
  Calendar, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Star,
  Trash2,
  Plus,
  ExternalLink,
  Link as LinkIcon,
  Workflow as WorkflowIcon,
  Settings,
  Pencil
} from 'lucide-react';
import pinyin from 'pinyin';
import { debounce } from 'lodash';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router-dom';

// 初始化导航数据到localStorage
const initializeNavData = () => {
  const navDataFromStorage = localStorage.getItem('navData');
  if (!navDataFromStorage) {
    // 这里我们直接定义数据而不是从外部导入
    const defaultNavData = {
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
    localStorage.setItem('navData', JSON.stringify(defaultNavData));
    return defaultNavData;
  }
  return JSON.parse(navDataFromStorage);
};

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [favoriteLinks, setFavoriteLinks] = useState([]);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [navData, setNavData] = useState({ mainCategories: [], devLinks: [] });

  // 初始化导航数据
  useEffect(() => {
    const data = initializeNavData();
    setNavData(data);
  }, []);

  // 从 localStorage 加载收藏链接
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteLinks');
    if (savedFavorites) {
      try {
        setFavoriteLinks(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorite links from localStorage', e);
      }
    }
  }, []);

  // 保存收藏链接到 localStorage
  useEffect(() => {
    localStorage.setItem('favoriteLinks', JSON.stringify(favoriteLinks));
  }, [favoriteLinks]);

  // 为每个链接添加拼音搜索支持
  const devLinksWithPinyin = useMemo(() => {
    return navData.devLinks.map(section => ({
      ...section,
      links: section.links.map(link => ({
        ...link,
        pinyin: pinyin(link.name, { style: pinyin.STYLE_NORMAL }).flat().join('').toLowerCase(),
        firstLetters: pinyin(link.name, { style: pinyin.STYLE_FIRST_LETTER }).flat().join('').toLowerCase()
      })),
      pinyin: pinyin(section.category, { style: pinyin.STYLE_NORMAL }).flat().join('').toLowerCase(),
      firstLetters: pinyin(section.category, { style: pinyin.STYLE_FIRST_LETTER }).flat().join('').toLowerCase()
    }));
  }, [navData.devLinks]);

  // 分词搜索函数
  const tokenize = (str) => {
    return str.toLowerCase().split(/\s+/).filter(token => token.length > 0);
  };

  // 检查是否匹配分词
  const matchesTokens = (text, tokens) => {
    const lowerText = text.toLowerCase();
    return tokens.every(token => lowerText.includes(token));
  };

  // 检查是否匹配首字母
  const matchesFirstLetters = (firstLetters, term) => {
    return firstLetters.includes(term.toLowerCase());
  };

  // 根据搜索词过滤链接
  const filteredLinks = useMemo(() => {
    if (!searchTerm) return devLinksWithPinyin;
    
    const term = searchTerm.trim();
    if (!term) return devLinksWithPinyin;
    
    const tokens = tokenize(term);
    
    return devLinksWithPinyin
      .map(section => {
        // 检查分类名称是否匹配
        const categoryMatch = 
          matchesTokens(section.category, tokens) || 
          matchesTokens(section.pinyin, tokens) ||
          matchesFirstLetters(section.firstLetters, term);
        
        // 过滤匹配的链接
        const filteredLinks = section.links.filter(link => 
          matchesTokens(link.name, tokens) || 
          matchesTokens(link.pinyin, tokens) ||
          matchesFirstLetters(link.firstLetters, term) ||
          link.url.toLowerCase().includes(term.toLowerCase())
        );
        
        // 如果分类匹配或有匹配的链接，则返回该分类
        return {
          ...section,
          links: categoryMatch ? section.links : filteredLinks
        };
      })
      .filter(section => 
        matchesTokens(section.category, tokens) || 
        matchesTokens(section.pinyin, tokens) ||
        matchesFirstLetters(section.firstLetters, term) ||
        section.links.length > 0
      );
  }, [devLinksWithPinyin, searchTerm]);

  const handleLinkClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 防抖搜索处理
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSetSearchTerm(e.target.value);
  };

  // 切换分类展开/收起
  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // 获取主分类下的子分类
  const getSubCategories = (mainCategoryId) => {
    return filteredLinks.filter(section => section.mainCategory === mainCategoryId);
  };

  // 添加到收藏
  const addToFavorites = (link) => {
    if (!favoriteLinks.some(fav => fav.url === link.url)) {
      setFavoriteLinks([...favoriteLinks, link]);
    }
  };

  // 从收藏中删除
  const removeFromFavorites = (url) => {
    setFavoriteLinks(favoriteLinks.filter(link => link.url !== url));
  };

  // 切换收藏状态
  const toggleFavorite = (link) => {
    if (favoriteLinks.some(fav => fav.url === link.url)) {
      removeFromFavorites(link.url);
    } else {
      addToFavorites(link);
    }
  };

  // 快捷键处理 - Ctrl+S 显示所有链接
  useHotkeys('ctrl+s', (event) => {
    event.preventDefault();
    setShowAllLinks(true);
  });

  // 关闭所有链接展示
  const closeAllLinks = useCallback(() => {
    setShowAllLinks(false);
  }, []);

  // 点击外部关闭所有链接展示
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAllLinks && !event.target.closest('.all-links-modal')) {
        closeAllLinks();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAllLinks, closeAllLinks]);

  // 图标映射
  const iconMap = {
    Code: <Code className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    TestTube: <TestTube className="h-5 w-5" />,
    Server: <Server className="h-5 w-5" />,
    Wrench: <Wrench className="h-5 w-5" />,
    Database: <Database className="h-5 w-5" />,
    BarChart: <BarChart className="h-5 w-5" />,
    Shield: <Shield className="h-5 w-5" />,
    GitBranch: <GitBranch className="h-5 w-5" />,
    Calendar: <Calendar className="h-5 w-5" />,
    FileText: <FileText className="h-5 w-5" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">开发导航中心</h1>
          <p className="text-gray-600 mb-6">一站式访问所有开发相关资源和工具</p>
          
          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="搜索资源、分类或链接... (支持首字母/分词搜索)"
                onChange={handleSearchChange}
                className="w-full py-6 text-lg pl-6 pr-12 rounded-xl shadow-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* 搜索结果统计 */}
        {searchTerm && (
          <div className="text-center mb-6">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              找到 {filteredLinks.reduce((acc, section) => acc + section.links.length, 0)} 个结果
            </Badge>
          </div>
        )}
        
        {/* 快捷入口 */}
        <div className="mb-8">
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/workflow')}
              className="flex items-center gap-2 text-lg py-6 px-8"
              variant="outline"
            >
              <WorkflowIcon className="h-5 w-5" />
              我的工作流
            </Button>
          </div>
        </div>
        
        {/* 标签页 */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="all" className="text-lg py-3">全部资源</TabsTrigger>
            <TabsTrigger value="favorites" className="text-lg py-3">常用资源</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {/* 主分类展示 */}
            <div className="space-y-6">
              {navData.mainCategories.map((mainCategory) => {
                const subCategories = getSubCategories(mainCategory.id);
                const isExpanded = expandedCategories.has(mainCategory.id) || searchTerm; // 搜索时默认展开
                
                // 如果没有子分类且不是搜索状态，则不显示该主分类
                if (subCategories.length === 0 && !searchTerm) return null;
                
                return (
                  <Card key={mainCategory.id} className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-6 cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                      onClick={() => toggleCategory(mainCategory.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${mainCategory.color} text-white`}>
                          {iconMap[mainCategory.icon] || <Code className="h-5 w-5" />}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{mainCategory.name}</h2>
                          <p className="text-gray-500">{mainCategory.description}</p>
                        </div>
                      </div>
                      {isExpanded ? 
                        <ChevronDown className="h-6 w-6 text-gray-500" /> : 
                        <ChevronRight className="h-6 w-6 text-gray-500" />
                      }
                    </div>
                    
                    {isExpanded && (
                      <div className="p-6 pt-0 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {subCategories.map((section, index) => (
                            <Card key={index} className="shadow-md hover:shadow-xl transition-shadow rounded-xl overflow-hidden border-0">
                              <CardHeader className="bg-white pb-3">
                                <CardTitle className="text-xl flex items-center gap-2">
                                  <div className={`p-2 rounded-lg ${section.color}`}>
                                    {iconMap[section.icon] || <Code className="h-5 w-5" />}
                                  </div>
                                  {section.category}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="bg-white pt-3">
                                <div className="space-y-3">
                                  {section.links.map((link, linkIndex) => (
                                    <div 
                                      key={linkIndex} 
                                      className="flex items-center justify-between group"
                                      onMouseEnter={() => setHoveredLink(link)}
                                      onMouseLeave={() => setHoveredLink(null)}
                                    >
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-between h-auto py-3 px-4 text-left group-hover:bg-gray-100 rounded-lg transition-colors"
                                        onClick={() => handleLinkClick(link.url)}
                                      >
                                        <span className="font-medium">{link.name}</span>
                                        <div className="flex items-center gap-2">
                                          <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-2 rounded-full hover:bg-primary/10"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleFavorite(link);
                                        }}
                                      >
                                        {favoriteLinks.some(fav => fav.url === link.url) ? (
                                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ) : (
                                          <Star className="h-4 w-4 text-gray-400" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-white pb-6">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  常用资源
                </CardTitle>
                <p className="text-gray-500">您收藏的常用链接将显示在这里</p>
              </CardHeader>
              <CardContent className="bg-gray-50 p-6 min-h-[300px]">
                {favoriteLinks.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无收藏</h3>
                    <p className="text-gray-400 mb-6">在"全部资源"标签页中，点击链接旁的星标图标来添加常用资源</p>
                    <Button onClick={() => {
                      const tabList = document.querySelector('[role="tablist"]');
                      if (tabList) {
                        const allTab = tabList.querySelector('[value="all"]');
                        if (allTab) allTab.click();
                      }
                    }}>
                      去添加常用资源
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteLinks.map((link, index) => (
                      <Card key={index} className="shadow-md rounded-xl border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">{link.name}</h3>
                              <p className="text-sm text-gray-500 truncate">{link.url}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 rounded-full hover:bg-destructive/10"
                              onClick={() => removeFromFavorites(link.url)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-3"
                            onClick={() => handleLinkClick(link.url)}
                          >
                            访问地址
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 悬浮展示所有链接的模态框 */}
      {showAllLinks && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="all-links-modal bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <LinkIcon className="h-6 w-6 text-blue-500" />
                  所有链接地址
                </h2>
                <Button variant="ghost" onClick={closeAllLinks} className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <p className="text-gray-500 mt-1">按 Ctrl+S 可快速显示此页面</p>
            </div>
            <div className="overflow-y-auto flex-grow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {navData.devLinks.map((section, sectionIndex) => (
                  <Card key={sectionIndex} className="border-0 shadow-md">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          {iconMap[section.icon] || <Code className="h-5 w-5" />}
                        </div>
                        {section.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <div className="space-y-3">
                        {section.links.map((link, linkIndex) => (
                          <div 
                            key={linkIndex} 
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                            onMouseEnter={() => setHoveredLink(link)}
                            onMouseLeave={() => setHoveredLink(null)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{link.name}</div>
                              <div className="text-sm text-gray-500 truncate">{link.url}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleLinkClick(link.url)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
              共 {navData.devLinks.reduce((acc, section) => acc + section.links.length, 0)} 个链接
            </div>
          </div>
        </div>
      )}

      {/* 链接提示悬浮层 */}
      {hoveredLink && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg shadow-lg z-40 max-w-xs">
          <div className="font-medium">{hoveredLink.name}</div>
          <div className="text-sm text-gray-300 truncate">{hoveredLink.url}</div>
          <div className="text-xs mt-1 text-gray-400">点击访问链接</div>
        </div>
      )}

      {/* 悬浮编辑按钮 */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={() => navigate('/nav-management')}
        >
          <Pencil className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
