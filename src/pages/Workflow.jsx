import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  Circle,
  Calendar,
  Clock,
  Search,
  Tag,
  Archive,
  X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

const Workflow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [archivedWorkflows, setArchivedWorkflows] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urls, setUrls] = useState([{ id: uuidv4(), name: '', url: '' }]);
  const [type, setType] = useState('permanent'); // 'permanent' or 'temporary'
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // 从 localStorage 加载工作流
  useEffect(() => {
    const savedWorkflows = localStorage.getItem('workflows');
    if (savedWorkflows) {
      try {
        setWorkflows(JSON.parse(savedWorkflows));
      } catch (e) {
        console.error('Failed to parse workflows from localStorage', e);
      }
    }

    const savedArchivedWorkflows = localStorage.getItem('archivedWorkflows');
    if (savedArchivedWorkflows) {
      try {
        setArchivedWorkflows(JSON.parse(savedArchivedWorkflows));
      } catch (e) {
        console.error('Failed to parse archived workflows from localStorage', e);
      }
    }
  }, []);

  // 保存工作流到 localStorage
  useEffect(() => {
    localStorage.setItem('workflows', JSON.stringify(workflows));
  }, [workflows]);

  // 保存归档工作流到 localStorage
  useEffect(() => {
    localStorage.setItem('archivedWorkflows', JSON.stringify(archivedWorkflows));
  }, [archivedWorkflows]);

  const handleAddUrl = () => {
    setUrls([...urls, { id: uuidv4(), name: '', url: '' }]);
  };

  const handleRemoveUrl = (id) => {
    if (urls.length > 1) {
      setUrls(urls.filter(url => url.id !== id));
    }
  };

  const handleUrlChange = (id, field, value) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, [field]: value } : url
    ));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setUrls([{ id: uuidv4(), name: '', url: '' }]);
    setType('permanent');
    setTags([]);
    setCurrentTag('');
    setCurrentWorkflow(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const workflow = {
      id: currentWorkflow ? currentWorkflow.id : uuidv4(),
      name,
      description,
      urls: urls.filter(url => url.name && url.url),
      type,
      tags,
      completed: currentWorkflow ? currentWorkflow.completed : false,
      createdAt: currentWorkflow ? currentWorkflow.createdAt : new Date().toISOString()
    };

    if (currentWorkflow) {
      // 更新工作流
      setWorkflows(workflows.map(w => w.id === currentWorkflow.id ? workflow : w));
    } else {
      // 添加新工作流
      setWorkflows([...workflows, workflow]);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (workflow) => {
    setCurrentWorkflow(workflow);
    setName(workflow.name);
    setDescription(workflow.description);
    setUrls(workflow.urls.length > 0 ? workflow.urls : [{ id: uuidv4(), name: '', url: '' }]);
    setType(workflow.type);
    setTags(workflow.tags || []);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const workflowToDelete = workflows.find(w => w.id === id);
    if (workflowToDelete) {
      setArchivedWorkflows([...archivedWorkflows, workflowToDelete]);
      setWorkflows(workflows.filter(workflow => workflow.id !== id));
    }
  };

  const handleRestoreWorkflow = (id) => {
    const workflowToRestore = archivedWorkflows.find(w => w.id === id);
    if (workflowToRestore) {
      setWorkflows([...workflows, workflowToRestore]);
      setArchivedWorkflows(archivedWorkflows.filter(workflow => workflow.id !== id));
    }
  };

  const handleDeletePermanently = (id) => {
    setArchivedWorkflows(archivedWorkflows.filter(workflow => workflow.id !== id));
  };

  const handleOpenWorkflow = (workflow) => {
    // 在新窗口中一次性打开所有URL
    const urlsToOpen = workflow.urls.map(url => url.url);
    
    // 创建一个临时的隐藏iframe来批量打开链接
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Opening Links</title></head>
      <body>
        ${urlsToOpen.map(url => `<a href="${url}" target="_blank" rel="noopener noreferrer"></a>`).join('')}
        <script>
          const links = document.querySelectorAll('a');
          links.forEach(link => {
            link.click();
          });
          setTimeout(() => {
            window.close();
          }, 1000);
        </script>
      </body>
      </html>
    `);
    iframeDoc.close();
    
    // 移除iframe
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  };

  const handleToggleComplete = (id) => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === id && workflow.type === 'temporary') {
        return { ...workflow, completed: !workflow.completed };
      }
      return workflow;
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 防抖搜索处理
  const debouncedSetSearchTerm = useMemo(
    () => debounce((value) => setSearchTerm(value), 300),
    []
  );

  const handleSearchChange = (e) => {
    debouncedSetSearchTerm(e.target.value);
  };

  // 根据搜索词和标签过滤工作流
  const filteredWorkflows = useMemo(() => {
    if (!searchTerm) return { permanent: workflows.filter(w => w.type === 'permanent'), temporary: workflows.filter(w => w.type === 'temporary') };
    
    const term = searchTerm.trim().toLowerCase();
    if (!term) return { permanent: workflows.filter(w => w.type === 'permanent'), temporary: workflows.filter(w => w.type === 'temporary') };
    
    const filteredPermanent = workflows.filter(w => 
      w.type === 'permanent' && 
      (w.name.toLowerCase().includes(term) || 
       w.description.toLowerCase().includes(term) ||
       (w.tags && w.tags.some(tag => tag.toLowerCase().includes(term))) ||
       w.urls.some(url => url.name.toLowerCase().includes(term) || url.url.toLowerCase().includes(term)))
    );
    
    const filteredTemporary = workflows.filter(w => 
      w.type === 'temporary' && 
      (w.name.toLowerCase().includes(term) || 
       w.description.toLowerCase().includes(term) ||
       (w.tags && w.tags.some(tag => tag.toLowerCase().includes(term))) ||
       w.urls.some(url => url.name.toLowerCase().includes(term) || url.url.toLowerCase().includes(term)))
    );
    
    return { permanent: filteredPermanent, temporary: filteredTemporary };
  }, [workflows, searchTerm]);

  const permanentWorkflows = searchTerm ? filteredWorkflows.permanent : workflows.filter(w => w.type === 'permanent');
  const temporaryWorkflows = searchTerm ? filteredWorkflows.temporary : workflows.filter(w => w.type === 'temporary');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">我的工作流</h1>
          <p className="text-gray-600">管理工作流，一键打开相关页面</p>
        </div>

        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="搜索工作流名称、描述、标签或链接..."
              onChange={handleSearchChange}
              className="w-full py-6 text-lg pl-12 pr-6 rounded-xl shadow-lg"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 text-lg py-6 px-8">
                <Plus className="h-5 w-5" />
                新建工作流
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {currentWorkflow ? '编辑工作流' : '新建工作流'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">工作流名称</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：发包工作流"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">描述</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="描述这个工作流的用途"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">标签</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="输入标签并按回车添加"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag}>添加</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-gray-200 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">工作流类型</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        type === 'permanent' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setType('permanent')}
                    >
                      <div className="font-medium">永久工作流</div>
                      <div className="text-sm text-gray-500 mt-1">每日/每月运行的常规流程</div>
                    </div>
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                        type === 'temporary' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setType('temporary')}
                    >
                      <div className="font-medium">临时工作流</div>
                      <div className="text-sm text-gray-500 mt-1">类似待办事项，可标记完成</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">相关页面</label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddUrl}>
                      <Plus className="h-4 w-4 mr-1" />
                      添加页面
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {urls.map((url, index) => (
                      <div key={url.id} className="flex gap-2">
                        <Input
                          value={url.name}
                          onChange={(e) => handleUrlChange(url.id, 'name', e.target.value)}
                          placeholder="页面名称"
                        />
                        <Input
                          value={url.url}
                          onChange={(e) => handleUrlChange(url.id, 'url', e.target.value)}
                          placeholder="页面地址"
                        />
                        {urls.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleRemoveUrl(url.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    取消
                  </Button>
                  <Button type="submit">
                    {currentWorkflow ? '更新工作流' : '创建工作流'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 永久工作流 */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-500" />
                永久工作流
              </CardTitle>
              <p className="text-gray-500">常规流程，可重复使用</p>
            </CardHeader>
            <CardContent className="bg-gray-50 p-6 min-h-[300px]">
              {permanentWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无永久工作流</h3>
                  <p className="text-gray-400">点击"新建工作流"创建第一个永久工作流</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {permanentWorkflows.map((workflow) => (
                    <Card key={workflow.id} className="shadow-md rounded-xl border-0">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">{workflow.name}</h3>
                            {workflow.description && (
                              <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
                            )}
                            {workflow.tags && workflow.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {workflow.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>创建于 {formatDate(workflow.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenWorkflow(workflow)}
                              className="flex items-center gap-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              打开
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(workflow)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(workflow.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {workflow.urls.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm text-gray-500 mb-2">相关页面:</div>
                            <div className="flex flex-wrap gap-2">
                              {workflow.urls.map((url, index) => (
                                <div 
                                  key={index} 
                                  className="bg-white px-3 py-1 rounded-full text-xs border"
                                >
                                  {url.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 临时工作流 */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-white pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-500" />
                临时工作流
              </CardTitle>
              <p className="text-gray-500">待办事项，可标记完成</p>
            </CardHeader>
            <CardContent className="bg-gray-50 p-6 min-h-[300px]">
              {temporaryWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无临时工作流</h3>
                  <p className="text-gray-400">点击"新建工作流"创建第一个临时工作流</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {temporaryWorkflows.map((workflow) => (
                    <Card 
                      key={workflow.id} 
                      className={`shadow-md rounded-xl border-0 ${
                        workflow.completed ? 'opacity-70' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mt-1"
                              onClick={() => handleToggleComplete(workflow.id)}
                            >
                              {workflow.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </Button>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold text-lg ${
                                workflow.completed ? 'line-through text-gray-500' : ''
                              }`}>
                                {workflow.name}
                              </h3>
                              {workflow.description && (
                                <p className={`text-sm ${
                                  workflow.completed ? 'text-gray-400 line-through' : 'text-gray-500'
                                } mt-1`}>
                                  {workflow.description}
                                </p>
                              )}
                              {workflow.tags && workflow.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {workflow.tags.map((tag, index) => (
                                    <Badge 
                                      key={index} 
                                      variant={workflow.completed ? "secondary" : "outline"} 
                                      className={`text-xs ${workflow.completed ? 'line-through' : ''}`}
                                    >
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                <Calendar className="h-3 w-3" />
                                <span>创建于 {formatDate(workflow.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {!workflow.completed && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenWorkflow(workflow)}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                打开
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(workflow)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(workflow.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {workflow.urls.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="text-sm text-gray-500 mb-2">相关页面:</div>
                            <div className="flex flex-wrap gap-2">
                              {workflow.urls.map((url, index) => (
                                <div 
                                  key={index} 
                                  className={`px-3 py-1 rounded-full text-xs border ${
                                    workflow.completed 
                                      ? 'bg-gray-100 text-gray-400 border-gray-300' 
                                      : 'bg-white'
                                  }`}
                                >
                                  {url.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 归档工作流悬浮按钮 */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setShowArchived(true)}
        >
          <Archive className="h-6 w-6" />
        </Button>
      </div>

      {/* 归档工作流对话框 */}
      <Dialog open={showArchived} onOpenChange={setShowArchived}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              已归档的工作流
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {archivedWorkflows.length === 0 ? (
              <div className="text-center py-8">
                <Archive className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">暂无归档工作流</h3>
                <p className="text-gray-400">已删除的工作流会出现在这里</p>
              </div>
            ) : (
              <div className="space-y-4">
                {archivedWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="shadow-md rounded-xl border-0">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg">{workflow.name}</h3>
                          {workflow.description && (
                            <p className="text-sm text-gray-500 mt-1">{workflow.description}</p>
                          )}
                          {workflow.tags && workflow.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {workflow.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            <span>创建于 {formatDate(workflow.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreWorkflow(workflow.id)}
                          >
                            恢复
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePermanently(workflow.id)}
                          >
                            永久删除
                          </Button>
                        </div>
                      </div>
                      {workflow.urls.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-sm text-gray-500 mb-2">相关页面:</div>
                          <div className="flex flex-wrap gap-2">
                            {workflow.urls.map((url, index) => (
                              <div 
                                key={index} 
                                className="bg-white px-3 py-1 rounded-full text-xs border"
                              >
                                {url.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Workflow;
