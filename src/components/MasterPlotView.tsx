import React, { useState, useEffect } from 'react';
import { MasterPlot, Story } from '../types';
import { GitBranch, Save, Sparkles, ShieldCheck } from 'lucide-react';

interface MasterPlotViewProps {
  story: Story | null;
  masterPlot: MasterPlot | null;
  onSaveMasterPlot: (plot: MasterPlot) => void;
}

export const MasterPlotView: React.FC<MasterPlotViewProps> = ({
  story,
  masterPlot,
  onSaveMasterPlot
}) => {
  const [formData, setFormData] = useState<MasterPlot>({
    id: 'plot-' + Date.now(),
    storyId: story?.id || '',
    logline: '',
    hook: '',
    act1: '',
    act2: '',
    act3: '',
    midpoint: '',
    climax: '',
    ending: '',
    mainConflict: '',
    subConflicts: '',
    characterArcSummary: ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (masterPlot) {
      setFormData(masterPlot);
    } else if (story) {
      setFormData((prev) => ({
        ...prev,
        storyId: story.id,
        logline: story.synopsis || ''
      }));
    }
  }, [masterPlot, story]);

  const handleChange = (field: keyof MasterPlot, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSaveMasterPlot(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  if (!story) {
    return <div className="p-8 text-center text-slate-400 text-sm">Vui lòng chọn bộ truyện trước.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-purple-400" />
            Kịch Bản Tổng Thể (Master Plot & Structure)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cấu trúc 3 Hồi (Act 1, Act 2, Act 3), Midpoint và Climax đảm bảo tính <strong>nhân quả logic</strong> cho bộ truyện <strong className="text-amber-300">"{story.title}"</strong>.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Save className="w-4 h-4" />
          {savedSuccess ? 'Đã Lưu Kịch Bản!' : 'Lưu Kịch Bản'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">HỒI 1 (Act 1: Mở Đầu)</h2>
          <p className="text-xs text-slate-400">Giới thiệu nhân vật, bối cảnh và sự cố phát sinh (Inciting Incident).</p>
          <textarea
            value={formData.act1}
            onChange={(e) => handleChange('act1', e.target.value)}
            rows={6}
            placeholder="Mô tả diên biến Hồi 1..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider">HỒI 2 (Act 2: Phát Triển)</h2>
          <p className="text-xs text-slate-400">Các thử thách, xung đột dâng cao và Điểm Giữa (Midpoint).</p>
          <textarea
            value={formData.act2}
            onChange={(e) => handleChange('act2', e.target.value)}
            rows={6}
            placeholder="Mô tả diễn biến Hồi 2..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
          />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">HỒI 3 (Act 3: Cao Trào)</h2>
          <p className="text-xs text-slate-400">Trận chiến quyết định (Climax) và Kết thúc (Resolution).</p>
          <textarea
            value={formData.act3}
            onChange={(e) => handleChange('act3', e.target.value)}
            rows={6}
            placeholder="Mô tả diễn biến Hồi 3..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
          />
        </div>
      </div>
    </div>
  );
};
