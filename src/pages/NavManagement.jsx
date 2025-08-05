import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
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
  Link,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavManagement = () => {
  const navigate = useNavigate();
  const [navData, setNavData] = useState({ mainCategories: [], devLinks: [] });
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentLink, setCurrentLink] = useState(null);
  const [editingCategory, setEditingCategory] = useState({
    id: '',
    name: '',
    icon: 'Code',
    description: '',
    color: 'bg-blue-500'
  });
  const [editingLink, setEditingLink] = useState({
    category: '',
    mainCategory: '',
    icon: 'Code',
    color: 'bg-blue-100 text-blue-800',
    links: [{ name: '', url: '' }]
  });

  // 图标映射
  const iconMap = {
    Code: Code,
    Users: Users,
    TestTube: TestTube,
    Server: Server,
    Wrench: Wrench,
    Database: Database,
    BarChart: BarChart,
    Shield: Shield,
    GitBranch: GitBranch,
    Calendar: Calendar,
    FileText: FileText
  };

  // 颜色选项
  const colorOptions = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ];

  // 链接颜色选项
  const linkColorOptions = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-red-100 text-red-800',
    'bg-yellow-100 text-yellow-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-gray-100 text-gray-800'
  ];

  // 从 localStorage 加载导航数据
  useEffect(() => {
    const data = localStorage.getItem('navData');
    if (data) {
      try {
        setNavData(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse navData from localStorage', e);
      }
    }
  }, []);

  // 保存导航数据到 localStorage
  const saveNavData = (newNavData) => {
    setNavData(newNavData);
    localStorage.setItem('navData', JSON.stringify(newNavData));
  };

  // 重置分类表单
  const resetCategoryForm = () => {
    setEditingCategory({
      id: '',
      name: '',
      icon: 'Code',
      description: '',
      color: 'bg-blue-500'
    });
    setCurrentCategory(null);
  };

  // 重置链接表单
  const resetLinkForm = () => {
    setEditingLink({
      category: '',
      mainCategory: '',
      icon: 'Code',
      color: 'bg-blue-100 text-blue-800',
      links: [{ name: '', url: '' }]
    });
    setCurrentLink(null);
  };

  // 处理分类表单提交
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    
    const newNavData = { ...navData };
    
    if (currentCategory) {
      // 更新现有分类
      const index = newNavData.mainCategories.findIndex(c => c.id === currentCategory.id);
      if (index !== -1) {
        newNavData.mainCategories[index] = {
          ...editingCategory,
          id: editingCategory.id || currentCategory.id
        };
      }
    } else {
      // 添加新分类
      newNavData.mainCategories.push({
        ...editingCategory,
        id: editingCategory.id || `cat-${Date.now()}`
      });
    }
    
    saveNavData(newNavData);
    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };

  // 处理链接表单提交
  const handleLinkSubmit = (e) => {
    e.preventDefault();
    
    const newNavData = { ...navData };
    
    if (currentLink) {
      // 更新现有链接组
      const index = newNavData.devLinks.findIndex(l => 
        l.category === currentLink.category && l.mainCategory === currentLink.mainCategory
      );
      if (index !== -1) {
        newNavData.devLinks[index] = editingLink;
      }
    } else {
      // 添加新链接组
      newNavData.devLinks.push(editingLink);
    }
    
    saveNavData(newNavData);
    setIsLinkDialogOpen(false);
    resetLinkForm();
  };

  // 准备编辑分类
  const prepareEditCategory = (category) => {
    setCurrentCategory(category);
    setEditingCategory({ ...category });
    setIsCategoryDialogOpen(true);
  };

  // 准备编辑链接
  const prepareEditLink = (link) => {
    setCurrentLink(link);
    setEditingLink({ ...link });
    setIsLinkDialogOpen(true);
  };

  // 删除分类
  const deleteCategory = (categoryId) => {
    const newNavData = { ...navData };
    
    // 删除分类
    newNavData.mainCategories = newNavData.mainCategories.filter(c => c.id !== categoryId);
    
    // 删除该分类下的所有链接组
    newNavData.devLinks = newNavData.devLinks.filter(l => l.mainCategory !== categoryId);
    
    saveNavData(newNavData);
  };

  // 删除链接组
  const deleteLinkGroup = (linkGroup) => {
    const newNavData = { ...navData };
    newNavData.devLinks = newNavData.devLinks.filter(l => 
      !(l.category === linkGroup.category && l.mainCategory === linkGroup.mainCategory)
    );
    saveNavData(newNavData);
  };

  // 添加链接到链接组
  const addLinkToGroup = () => {
    setEditingLink({
      ...editingLink,
      links: [...editingLink.links, { name: '', url: '' }]
    });
  };

  // 更新链接组中的链接
  const updateLinkInGroup = (index, field, value) => {
    const newLinks = [...editingLink.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditingLink({
      ...editingLink,
      links: newLinks
    });
  };

  // 删除链接组中的链接
  const removeLinkFromGroup = (index) => {
    if (editingLink.links.length > 1) {
      const newLinks = [...editingLink.links];
      newLinks.splice(index, 1);
      setEditingLink({
        ...editingLink,
        links: newLinks
      });
    }
  };

  // 图标选择器组件
  const IconSelector = ({ selectedIcon, onIconSelect, iconSize = 20 }) => {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2 border rounded-lg max-h-40 overflow-y-auto">
        {Object.keys(iconMap).map((iconName) => {
          const IconComponent = iconMap[iconName];
          return (
            <div
              key={iconName}
              className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all ${
                selectedIcon === iconName
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onIconSelect(iconName)}
            >
              <IconComponent size={iconSize} />
              <span className="text-xs mt-1 truncate w-full text-center">{iconName}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">导航管理</h1>
            <p className="text-gray-600">自定义您的导航分类和链接</p>
          </div>
          <Button onClick={() => navigate('/')} variant="outline">
            返回首页
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 分类管理 */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">分类管理</CardTitle>
                <Dialog 
                  open={isCategoryDialogOpen} 
                  onOpenChange={(open) => {
                    setIsCategoryDialogOpen(open);
                    if (!open) resetCategoryForm();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      添加分类
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {currentCategory ? '编辑分类' : '添加分类'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">分类ID</label>
                        <Input
                          value={editingCategory.id}
                          onChange={(e) => setEditingCategory({...editingCategory, id: e.target.value})}
                          placeholder="例如：dev-tools"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">分类名称</label>
                        <Input
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                          placeholder="例如：开发工具"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">描述</label>
                        <Textarea
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                          placeholder="分类描述"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">图标</label>
                        <IconSelector
                          selectedIcon={editingCategory.icon}
                          onIconSelect={(icon) => setEditingCategory({...editingCategory, icon})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">颜色</label>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map(color => (
                            <div
                              key={color}
                              className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                                editingCategory.color === color ? 'border-gray-800' : 'border-gray-300'
                              } ${color}`}
                              onClick={() => setEditingCategory({...editingCategory, color})}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsCategoryDialogOpen(false);
                            resetCategoryForm();
                          }}
                        >
                          取消
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          保存
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-gray-500">管理主要分类</p>
            </CardHeader>
            <CardContent className="bg-gray-50 p-6 min-h-[300px]">
              {navData.mainCategories.length === 0 ? (
                <div className="text-center py-12">
                  <Code className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无分类</h3>
                  <p className="text-gray-400">点击"添加分类"创建第一个分类</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {navData.mainCategories.map((category) => (
                    <Card key={category.id} className="shadow-md rounded-xl border-0">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${category.color} text-white`}>
                              {React.createElement(iconMap[category.icon] || Code, { className: "h-5 w-5" })}
                            </div>
                            <div>
                              <h3 className="font-semibold">{category.name}</h3>
                              <p className="text-sm text-gray-500">{category.description}</p>
                              <p className="text-xs text-gray-400 mt-1">ID: {category.id}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => prepareEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 链接管理 */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">链接管理</CardTitle>
                <Dialog 
                  open={isLinkDialogOpen} 
                  onOpenChange={(open) => {
                    setIsLinkDialogOpen(open);
                    if (!open) resetLinkForm();
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      添加链接组
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {currentLink ? '编辑链接组' : '添加链接组'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleLinkSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">分类名称</label>
                          <Input
                            value={editingLink.category}
                            onChange={(e) => setEditingLink({...editingLink, category: e.target.value})}
                            placeholder="例如：开发环境"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">主分类</label>
                          <select
                            value={editingLink.mainCategory}
                            onChange={(e) => setEditingLink({...editingLink, mainCategory: e.target.value})}
                            className="w-full p-2 border rounded"
                            required
                          >
                            <option value="">选择主分类</option>
                            {navData.mainCategories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">图标</label>
                          <IconSelector
                            selectedIcon={editingLink.icon}
                            onIconSelect={(icon) => setEditingLink({...editingLink, icon})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">颜色</label>
                          <div className="flex flex-wrap gap-2">
                            {linkColorOptions.map(color => (
                              <div
                                key={color}
                                className={`px-3 py-2 rounded cursor-pointer border ${
                                  editingLink.color === color ? 'border-gray-800' : 'border-gray-300'
                                } ${color}`}
                                onClick={() => setEditingLink({...editingLink, color})}
                              >
                                预览
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium">链接列表</label>
                          <Button type="button" variant="outline" size="sm" onClick={addLinkToGroup}>
                            <Plus className="h-4 w-4 mr-1" />
                            添加链接
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {editingLink.links.map((link, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={link.name}
                                onChange={(e) => updateLinkInGroup(index, 'name', e.target.value)}
                                placeholder="链接名称"
                                required
                              />
                              <Input
                                value={link.url}
                                onChange={(e) => updateLinkInGroup(index, 'url', e.target.value)}
                                placeholder="链接地址"
                                required
                              />
                              {editingLink.links.length > 1 && (
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => removeLinkFromGroup(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsLinkDialogOpen(false);
                            resetLinkForm();
                          }}
                        >
                          取消
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          保存
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-gray-500">管理链接组和链接</p>
            </CardHeader>
            <CardContent className="bg-gray-50 p-6 min-h-[300px]">
              {navData.devLinks.length === 0 ? (
                <div className="text-center py-12">
                  <Link className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无链接组</h3>
                  <p className="text-gray-400">点击"添加链接组"创建第一个链接组</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {navData.devLinks.map((linkGroup, index) => (
                    <Card key={index} className="shadow-md rounded-xl border-0">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${linkGroup.color}`}>
                              {React.createElement(iconMap[linkGroup.icon] || Code, { className: "h-5 w-5" })}
                            </div>
                            <div>
                              <h3 className="font-semibold">{linkGroup.category}</h3>
                              <p className="text-sm text-gray-500">
                                主分类: {navData.mainCategories.find(c => c.id === linkGroup.mainCategory)?.name || linkGroup.mainCategory}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {linkGroup.links.length} 个链接
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => prepareEditLink(linkGroup)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteLinkGroup(linkGroup)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm text-gray-500 mb-2">链接:</div>
                          <div className="flex flex-wrap gap-2">
                            {linkGroup.links.map((link, linkIndex) => (
                              <div 
                                key={linkIndex} 
                                className="bg-white px-3 py-1 rounded-full text-xs border"
                              >
                                {link.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NavManagement;
