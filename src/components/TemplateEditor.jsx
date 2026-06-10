import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Save, X, Eye, RotateCcw, Folder, Type, AlignLeft,
  Check, AlertCircle, Copy, Send, FileText, Inbox
} from 'lucide-react';
import { categories } from '../data/mockData';

function renderContentWithVariables(content) {
  const parts = content.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, index) => {
    if (part.match(/^\{\{[^}]+\}\}$/)) {
      return (
        <span
          key={index}
          className="inline-block px-1.5 py-0.5 mx-0.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-md text-sm font-medium border border-purple-200"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

const TemplateEditor = forwardRef(function TemplateEditor({ template, variables, onSave, onCancel }, ref) {
  const [title, setTitle] = useState(template?.title || '');
  const [category, setCategory] = useState(template?.category || 'greeting');
  const [content, setContent] = useState(template?.content || '');
  const [showPreview, setShowPreview] = useState(true);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const textareaRef = useRef(null);

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setCategory(template.category);
      setContent(template.content);
    } else {
      setTitle('');
      setCategory('greeting');
      setContent('');
    }
    setErrors({});
    setSaved(false);
  }, [template]);

  const insertVariable = (variableKey) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + variableKey + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        const pos = start + variableKey.length;
        textarea.setSelectionRange(pos, pos);
      }, 0);
    } else {
      setContent(content + variableKey);
    }
  };

  useImperativeHandle(ref, () => ({
    insertVariable,
  }));

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = '请输入模板标题';
    } else if (title.trim().length < 2) {
      newErrors.title = '标题至少需要2个字符';
    }
    if (!content.trim()) {
      newErrors.content = '请输入模板内容';
    } else if (content.trim().length < 10) {
      newErrors.content = '内容至少需要10个字符';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSave) {
      onSave({ ...template, title: title.trim(), category, content: content.trim() });
    }
  };

  const handleReset = () => {
    if (template) {
      setTitle(template.title);
      setCategory(template.category);
      setContent(template.content);
    } else {
      setTitle('');
      setCategory('greeting');
      setContent('');
    }
    setErrors({});
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
  };

  const filteredCategories = categories.filter(c => c.id !== 'all');
  const contentLength = content.length;

  if (!template) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center justify-center text-center max-w-sm px-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mb-5">
            <Inbox className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            暂无模板
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
              当前模板列表为空或已全部删除。请从左侧列表选择一个模板，或点击「新建模板」按钮创建新的快捷回复。
            </p>
            <div className="text-xs text-gray-400 border border-dashed border-gray-300 rounded-xl px-5 py-4 bg-white/60">
              提示：创建模板后，可通过变量库插入动态变量
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">
                {template ? '编辑模板' : '新建模板'}
              </h2>
              <p className="text-xs text-gray-500">
                {template ? `ID: ${template.id} · 更新于 ${template.updatedAt}` : '创建新的快捷回复模板'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
            <button
              onClick={handleCopyContent}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              复制内容
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                取消
              </button>
            )}
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm ${
                saved
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? '已保存' : '保存模板'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Type className="w-3.5 h-3.5 text-gray-400" />
              模板标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：首次接待欢迎语"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-200 focus:ring-purple-500 focus:border-transparent hover:border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2">
              <Folder className="w-3.5 h-3.5 text-gray-400" />
              所属分类
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all bg-white"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
              回复内容编辑
            </label>
            <div className="flex items-center gap-4">
              <span className={`text-xs ${contentLength > 500 ? 'text-amber-600' : 'text-gray-400'}`}>
                字数: {contentLength}
              </span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all ${
                  showPreview
                    ? 'bg-purple-100 text-purple-700 font-medium'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showPreview ? '预览中' : '显示预览'}
              </button>
            </div>
          </div>

          <div className="flex-1 flex gap-4 min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入快捷回复内容，使用 {{变量名}} 插入动态变量..."
                className={`flex-1 w-full p-4 text-sm leading-relaxed border rounded-xl resize-none focus:outline-none focus:ring-2 transition-all font-sans ${
                  errors.content
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-200 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 bg-white'
                }`}
              />
              {errors.content && (
                <p className="flex items-center gap-1 mt-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.content}
                </p>
              )}
            </div>

            {showPreview && (
              <div className="w-[420px] flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">实时预览（模拟发送）</span>
                </div>
                <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-4 overflow-y-auto">
                  <div className="flex justify-end mb-4">
                    <div className="max-w-[85%] bg-white rounded-2xl rounded-tr-sm shadow-sm border border-gray-100 p-3">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {renderContentWithVariables(content || '预览内容将显示在这里...')}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold mr-2 flex-shrink-0">
                      张
                    </div>
                    <div className="max-w-[75%] bg-white rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 p-3">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        你好，我想查询一下我的订单物流情况～
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl rounded-tr-sm shadow-sm p-3">
                      <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">
                        {renderContentWithVariables(
                          content
                            .replace(/\{\{客户昵称\}\}/g, '张先生')
                            .replace(/\{\{订单号\}\}/g, '202401150001')
                            .replace(/\{\{商品名称\}\}/g, '蓝牙耳机 Pro')
                            .replace(/\{\{客服姓名\}\}/g, '小美')
                            .replace(/\{\{联系方式\}\}/g, '400-888-8888')
                            .replace(/\{\{退款金额\}\}/g, '¥299.00')
                            .replace(/\{\{预计时间\}\}/g, '3-5个工作日')
                            || '预览内容将显示在这里...'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <button className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-sm">
                  <Send className="w-4 h-4" />
                  模拟发送效果
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default TemplateEditor;
