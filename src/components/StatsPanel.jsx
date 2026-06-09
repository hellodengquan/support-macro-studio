import {
  BarChart3, TrendingUp, Clock, Eye, Star,
  Calendar, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

function StatsPanel({ templates }) {
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const avgRating = (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1);
  const topTemplates = [...templates].sort((a, b) => b.usageCount - a.usageCount).slice(0, 3);

  const stats = [
    {
      label: '总使用次数',
      value: totalUsage.toLocaleString(),
      change: '+12.5%',
      up: true,
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: '平均评分',
      value: avgRating,
      change: '+0.3',
      up: true,
      icon: Star,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
    },
    {
      label: '模板数量',
      value: templates.length,
      change: '+2',
      up: true,
      icon: BarChart3,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
    },
    {
      label: '平均字数',
      value: '86',
      change: '-3.2%',
      up: false,
      icon: TrendingUp,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">使用数据统计</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              近 7 天数据概览
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-xl p-3`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${
                  stat.up ? 'text-green-600' : 'text-red-500'
                }`}>
                  {stat.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-800 mb-0.5">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-4">
        <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
          热门模板 TOP 3
        </p>
        <div className="space-y-2">
          {topTemplates.map((template, index) => (
            <div
              key={template.id}
              className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                index === 0
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                  : index === 1
                    ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                    : 'bg-gradient-to-br from-orange-300 to-amber-400 text-white'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{template.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                    <Eye className="w-3 h-3" />
                    {template.usageCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {template.rating}
                  </span>
                </div>
              </div>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${(template.usageCount / topTemplates[0].usageCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
