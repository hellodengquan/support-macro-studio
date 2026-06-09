import { useState } from 'react';
import {
  MessageSquareHeart, ThumbsUp, ThumbsDown, X, Check,
  Smile, Frown, Meh, Send, Star, FileCheck, Zap, Award
} from 'lucide-react';

const iconMap = {
  Check,
  Smile,
  FileCheck,
  Zap,
  Award,
};

function FeedbackPanel({ template, feedbackReasons, onClose }) {
  const [sentiment, setSentiment] = useState(null);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleReason = (reasonId) => {
    setSelectedReasons(prev =>
      prev.includes(reasonId)
        ? prev.filter(r => r !== reasonId)
        : [...prev, reasonId]
    );
  };

  const handleSubmit = () => {
    if (!sentiment) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSentiment(null);
      setSelectedReasons([]);
      setComment('');
    }, 2500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <MessageSquareHeart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">使用反馈</h3>
            <p className="text-xs text-gray-500">帮助我们优化模板质量</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {submitted ? (
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-1">感谢您的反馈！</h4>
          <p className="text-xs text-gray-500">您的建议将帮助我们持续改进</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">本次使用体验如何？</p>
            <div className="flex gap-2">
              <button
                onClick={() => setSentiment('good')}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                  sentiment === 'good'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-100 hover:border-green-200 hover:bg-green-50/50'
                }`}
              >
                <Smile className={`w-6 h-6 ${sentiment === 'good' ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${sentiment === 'good' ? 'text-green-700' : 'text-gray-500'}`}>好用</span>
              </button>
              <button
                onClick={() => setSentiment('neutral')}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                  sentiment === 'neutral'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-100 hover:border-amber-200 hover:bg-amber-50/50'
                }`}
              >
                <Meh className={`w-6 h-6 ${sentiment === 'neutral' ? 'text-amber-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${sentiment === 'neutral' ? 'text-amber-700' : 'text-gray-500'}`}>一般</span>
              </button>
              <button
                onClick={() => setSentiment('bad')}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                  sentiment === 'bad'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-100 hover:border-red-200 hover:bg-red-50/50'
                }`}
              >
                <Frown className={`w-6 h-6 ${sentiment === 'bad' ? 'text-red-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${sentiment === 'bad' ? 'text-red-700' : 'text-gray-500'}`}>需改进</span>
              </button>
            </div>
          </div>

          {sentiment && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">
                {sentiment === 'good' ? '哪些方面做得好？（可多选）' : '需要改进哪些地方？（可多选）'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {feedbackReasons.map((reason) => {
                  const IconComponent = iconMap[reason.icon] || Star;
                  const isSelected = selectedReasons.includes(reason.id);
                  return (
                    <button
                      key={reason.id}
                      onClick={() => toggleReason(reason.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? sentiment === 'bad'
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-purple-300 bg-purple-50 text-purple-700'
                          : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                      {reason.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">补充意见（选填）</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="您的宝贵建议..."
              rows={3}
              className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!sentiment}
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
              sentiment
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            提交反馈
          </button>
        </div>
      )}
    </div>
  );
}

export default FeedbackPanel;
