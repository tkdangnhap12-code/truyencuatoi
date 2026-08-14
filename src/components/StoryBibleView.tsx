import React, { useState, useEffect } from 'react';
import { StoryBible, Story } from '../types';
import { BookMarked, Save, Sparkles, Shield, AlertTriangle } from 'lucide-react';

interface StoryBibleViewProps {
  story: Story | null;
  bible: StoryBible | null;
  onSaveBible: (b: StoryBible) => void;
}

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({
  story,
  bible,
  onSaveBible
}) => {
  const [formData, setFormData] = useState<StoryBible>({
    id: 'bible-' + Date.now(),
    storyId: story?.id || '',
    logline: '',
    hook: '',
    premise: '',
    synopsis: '',
    theme: '',
    tone: '',
    worldRules: '',
    socialRules: '',
    politicalRules: '',
    magicTechnologyRules: '',
    importantEvents: '',
    forbiddenContradictions: ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (bible) {
      setFormData(bible);
    } else if (story) {
      setFormData((prev) => ({
        ...prev,
        storyId: story.id,
        synopsis: story.synopsis || ''
      }));
    }
  }, [bible, story]);

  const handleChange = (field: keyof StoryBible, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveBible(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (!story) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Vui lòng chọn hoặc tạo một truyện trước khi thiết lập Story Bible.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-amber-400" />
            Thánh Kinh Truyện (Story Bible)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Nguồn sự thật tối cao của bộ truyện <strong className="text-amber-300">"{story.title}"</strong>. AI bám sát tuyệt đối các quy tắc này.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Save className="w-4 h-4" />
          {savedSuccess ? 'Đã Lưu Bible!' : 'Lưu Story Bible'}
        </button>
      </div>

      <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-200">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Quy tắc tuyệt đối:</strong> Mọi chương truyện được sinh bởi AI sẽ tự động đọc dữ liệu từ Story Bible để đảm bảo tính nhất quán về thế giới quan, quy tắc ma pháp/công nghệ và tuyệt đối không phạm phải các điều cấm.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic core Bible */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">I. Cốt Lõi Cốt Truyện</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Logline (Tóm tắt 1 câu)</label>
            <input
              type="text"
              value={formData.logline}
              onChange={(e) => handleChange('logline', e.target.value)}
              placeholder="Câu tóm tắt giật gân 1 dòng..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Hook (Điểm thu hút chính)</label>
            <input
              type="text"
              value={formData.hook}
              onChange={(e) => handleChange('hook', e.target.value)}
              placeholder="Yếu tố giật gân khiến độc giả tò mò..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Premise (Tiền đề truyện)</label>
            <textarea
              value={formData.premise}
              onChange={(e) => handleChange('premise', e.target.value)}
              rows={3}
              placeholder="Giả định nền tảng câu chuyện..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Chủ Đề (Theme) & Giọng Văn (Tone)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={formData.theme}
                onChange={(e) => handleChange('theme', e.target.value)}
                placeholder="Chủ đề (ví dụ: Sự kiên trì)..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                value={formData.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
                placeholder="Giọng văn (ví dụ: Hào hùng pha hài)..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* World & Rules Bible */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">II. Quy Tắc Thế Giới & Xã Hội</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">World Rules (Quy tắc tự nhiên/thế giới)</label>
            <textarea
              value={formData.worldRules}
              onChange={(e) => handleChange('worldRules', e.target.value)}
              rows={3}
              placeholder="Cách địa hình, sinh thái, khí hậu vận hành..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Magic / Tech Rules (Hệ thống Ma Pháp / Công Nghệ)</label>
            <textarea
              value={formData.magicTechnologyRules}
              onChange={(e) => handleChange('magicTechnologyRules', e.target.value)}
              rows={3}
              placeholder="Các cấp độ tu luyện, thuộc tính phép thuật, giới hạn công nghệ..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Social & Political Rules (Hệ thống Xã hội & Chính trị)</label>
            <textarea
              value={formData.socialRules}
              onChange={(e) => handleChange('socialRules', e.target.value)}
              rows={3}
              placeholder="Phân chia giai cấp, tôn giáo, các thế lực đại diện..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
            />
          </div>
        </div>

        {/* Forbidden Contradictions */}
        <div className="md:col-span-2 bg-slate-900 border border-red-900/30 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Điều Cấm Trái Mâu Thuẫn (Forbidden Contradictions)
          </h2>
          <p className="text-xs text-slate-400">
            Liệt kê các chi tiết TUYỆT ĐỐI KHÔNG ĐƯỢC XẢY RA (ví dụ: "Lâm Tiếu chưa Trúc Cơ thì không thể tự bay", "Thần kiếm không thể hồi phục hoàn toàn trước chương 20").
          </p>
          <textarea
            value={formData.forbiddenContradictions}
            onChange={(e) => handleChange('forbiddenContradictions', e.target.value)}
            rows={3}
            placeholder="Liệt kê những điều cấm kỵ nhằm tránh lỗi logic..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
          />
        </div>
      </div>
    </div>
  );
};
