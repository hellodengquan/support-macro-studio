import { Folder, Hand, Package, RefreshCw, AlertTriangle, Star, Plus, Settings } from 'lucide-react';

const iconMap = {
  Folder,
  Hand,
  Package,
  RefreshCw,
  AlertTriangle,
  Star,
};

function CategorySidebar({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-600" />
          宏模板工作台
        </h1>
        <p className="text-xs text-gray-500 mt-1">客服快捷回复管理中心</p>
      </div>

      <div className="p-3">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm text-sm font-medium">
          <Plus className="w-4 h-4" />
          新建模板
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">模板分类</p>
        <nav className="space-y-1">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Folder;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-medium border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className="flex-1 text-left">{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
            客
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">客服小美</p>
            <p className="text-xs text-gray-500">昨日使用: 128次</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategorySidebar;
