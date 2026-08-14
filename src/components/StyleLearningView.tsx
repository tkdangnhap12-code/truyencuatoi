import React, { useState } from 'react';
import { StyleProfile } from '../types';
import { generateContentAI } from '../gemini';
import { FileText, Upload, Sparkles, CheckCircle2, Loader2, Trash2 } from 'lucide-react';

interface StyleLearningViewProps {
  styleProfiles: StyleProfile[];
  onSaveStyleProfile: (p: StyleProfile) => void;
  onDeleteStyleProfile: (id: string) => void;
}

export const StyleLearningView: React.FC<StyleLearningViewProps> = ({
  styleProfiles,
  onSaveStyleProfile,
  onDeleteStyleProfile
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [profileName, setProfileName] = useState('');
  const [sampleText, setSampleText] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileName(file.name.replace(/\.[^/.]+$/, '') + ' Profile');
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Take first 5,000 characters as representative sample for style analysis
        setSampleText(content.slice(0, 5000));
      }
    };

    reader.readAsText(file);
  };

  const handleAnalyzeStyle = async () => {
    if (!sampleText.trim()) {
      setErrorMsg('Vui lòng tải file văn bản hoặc dán đoạn văn bản mẫu!');
      return;
    }

    setAnalyzing(true);
    setErrorMsg('');

    try {
      const prompt = `Bạn là chuyên gia phân tích văn phong văn học. Hãy phân tích đoạn văn bản mẫu sau và rút ra "Hồ Sơ Văn Phong" (Writing Style Profile) dưới dạng JSON gồm các trường:
- sentenceStructure: Cấu trúc câu, độ dài trung bình, nhịp điệu.
- vocabularyAndTone: Từ vựng sử dụng (cổ xưa, hiện đại, sắc bén, châm biếm...), giọng văn.
- pacingAndRhythm: Tiết tấu truyện (nhanh, chậm, căng thẳng).
- dialogueStyle: Phong cách thoại giữa các nhân vật.
- descriptionStyle: Phong cách miêu tả cảnh vật và cảm xúc.

Văn bản mẫu:
"${sampleText.slice(0, 3000)}"

Trả về duy nhất JSON hợp lệ.`;

      const res = await generateContentAI(prompt, { jsonMode: true });
      const parsed = JSON.parse(res);

      const newProfile: StyleProfile = {
        id: 'style-' + Date.now(),
        name: profileName || 'Hồ Sơ Văn Phong Mới',
        sourceFileName: 'File Mẫu',
        sentenceStructure: parsed.sentenceStructure || 'Cấu trúc mượt mà, câu ngắn đan xen câu dài',
        vocabularyAndTone: parsed.vocabularyAndTone || 'Từ vựng sắc bén, giàu hình ảnh',
        pacingAndRhythm: parsed.pacingAndRhythm || 'Tiết tấu nhanh, cuốn hút',
        dialogueStyle: parsed.dialogueStyle || 'Thoại tự nhiên, phản ánh tính cách',
        descriptionStyle: parsed.descriptionStyle || 'Miêu tả tinh tế, tập trung cảm xúc',
        sampleExcerpts: sampleText.slice(0, 300),
        createdAt: Date.now()
      };

      onSaveStyleProfile(newProfile);
      setSampleText('');
      setProfileName('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi phân tích văn phong.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            Học Văn Phong Từ File (Style Learning Engine)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tải lên file văn mẫu (.TXT). AI sẽ phân tích nhịp điệu, cách dùng từ và lưu lại <strong>Hồ Sơ Văn Phong Profile</strong> mà <em>không lưu file gốc</em>.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Upload & Analysis Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-400" />
          I. Tải File Hoặc Dán Đoạn Văn Mẫu
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Hồ Sơ Văn Phong</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Ví dụ: Văn Phong Tiên Hiệp Hào Hùng..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Chọn File Văn Bản (.txt)</label>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Hoặc Dán Văn Bản Trực Tiếp Để Phân Tích</label>
          <textarea
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            placeholder="Dán 1-2 chương văn mẫu để AI học văn phong..."
            rows={5}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none"
          />
        </div>

        <button
          onClick={handleAnalyzeStyle}
          disabled={analyzing}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
        >
          {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Bắt Đầu Phân Tích & Tạo Profile Văn Phong
        </button>
      </div>

      {/* Style Profile Library List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          II. Thư Viện Hồ Sơ Văn Phong Đã Lưu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {styleProfiles.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-slate-500 text-xs italic">
              Chưa có hồ sơ văn phong nào. Vui lòng tải file mẫu và bấm phân tích.
            </div>
          ) : (
            styleProfiles.map((prof) => (
              <div key={prof.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 shadow-md">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-cyan-400">{prof.name}</h3>
                  <button
                    onClick={() => onDeleteStyleProfile(prof.id)}
                    className="p-1 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Cấu trúc câu:</strong> {prof.sentenceStructure}</p>
                  <p><strong className="text-slate-400">Từ vựng & Giọng văn:</strong> {prof.vocabularyAndTone}</p>
                  <p><strong className="text-slate-400">Tiết tấu:</strong> {prof.pacingAndRhythm}</p>
                  <p><strong className="text-slate-400">Hội thoại:</strong> {prof.dialogueStyle}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
