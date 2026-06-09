import { Variable, ChevronDown, ChevronUp, Copy, Info, Sparkles } from 'lucide-react';
import { useState } from 'react';

function VariablePanel({ variables, onInsertVariable, detectedVariables = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Variable className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 text-sm">模板变量库</h3>
            <p className="text-xs text-gray-500">点击插入变量到编辑区</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100">
          {detectedVariables.length > 0 && (
            <div className="p-4 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-800">当前模板已使用</span>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                  {detectedVariables.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectedVariables.map((v, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-white text-amber-700 rounded-md border border-amber-200 font-mono">
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
            {variables.map((variable) => {
              const isCopied = copiedKey === variable.key;
              return (
                <div
                  key={variable.key}
                  className="group p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{variable.name}</span>
                        <button
                          onClick={() => handleCopy(variable.key)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-100 rounded"
                          title="复制变量"
                        >
                          {isCopied ? (
                            <span className="text-xs text-green-600 font-medium">已复制</span>
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{variable.description}</p>
                    </div>
                    <button
                      onClick={() => onInsertVariable(variable.key)}
                      className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      插入
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-100 text-purple-700 px-2 py-1 rounded font-mono border border-gray-200">
                      {variable.key}
                    </code>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Info className="w-3 h-3" />
                      示例: <span className="text-gray-600">{variable.example}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default VariablePanel;
