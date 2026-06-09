import { Search, Star, Clock, Eye, Copy, Edit2, Trash2, ThumbsUp } from 'lucide-react';

function TemplateList({ templates, searchQuery, onSearchChange, onSelectTemplate, selectedId }) {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索模板标题或内容..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500">共 <span className="font-semibold text-gray-700">{templates.length}</span> 个模板</p>
          <div className="flex items-center gap-2 text-xs">
            <button className="px-2 py-1 rounded-md bg-purple-50 text-purple-600 font-medium">最近使用</button>
            <button className="px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100">使用量</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">暂无匹配的模板</p>
          </div>
        ) : (
          templates.map((template) => {
            const isSelected = selectedId === template.id;
            return (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-white border-purple-300 shadow-sm ring-1 ring-purple-100'
                    : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`text-sm font-semibold flex-1 ${isSelected ? 'text-purple-700' : 'text-gray-800'}`}>
                    {template.title}
                  </h3>
                  <Star className={`w-4 h-4 flex-shrink-0 ${template.rating >= 4.7 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                  {template.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {template.usageCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {template.rating}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {template.updatedAt}
                  </span>
                </div>
                <div className={`flex items-center gap-1 mt-3 pt-3 border-t ${isSelected ? 'border-purple-100' : 'border-gray-100'}`}>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-all">
                    <Copy className="w-3.5 h-3.5" />
                    复制
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                    编辑
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                    删除
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default TemplateList;
