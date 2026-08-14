import React, { useState, useRef, useEffect } from 'react';
import { Story, Chapter, ChapterMilestone, SceneItem, StoryBible } from '../types';
import { generateContentAI } from '../gemini';
import { 
  Edit3, 
  Sparkles, 
  Wand2, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  ListOrdered, 
  Clapperboard, 
  FileText, 
  Loader2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Type
} from 'lucide-react';

interface EditorViewProps {
  story: Story | null;
  chapters: Chapter[];
  bible: StoryBible | null;
  milestones: ChapterMilestone[];
  scenes: SceneItem[];
  onSaveChapter: (c: Chapter) => void;
  onAddChapter: () => void;
  onDeleteChapter: (id: string) => void;
  onSaveMilestones: (ms: ChapterMilestone[]) => void;
  onSaveScenes: (sc: SceneItem[]) => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  story,
  chapters,
  bible,
  milestones,
  scenes,
  onSaveChapter,
  onAddChapter,
  onDeleteChapter,
  onSaveMilestones,
  onSaveScenes
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'editor' | 'inspector'>('editor');
  const [focusMode, setFocusMode] = useState(false);

  // Current Chapter Form
  const currentChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const [content, setContent] = useState(currentChapter?.content || '');
  const [title, setTitle] = useState(currentChapter?.title || '');
  const [saving, setSaving] = useState(false);

  // Selection AI Toolbar State
  const [selectionText, setSelectionText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [showRewritePopup, setShowRewritePopup] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteResult, setRewriteResult] = useState('');

  // AI Generator Level State
  const [genLevel, setGenLevel] = useState<'chapter' | 'scene' | 'milestone'>('chapter');
  const [generatingAI, setGeneratingAI] = useState(false);

  // AI Suggestion State
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (currentChapter) {
      setContent(currentChapter.content || '');
      setTitle(currentChapter.title || '');
    }
  }, [currentChapter?.id]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    if (currentChapter) {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      onSaveChapter({
        ...currentChapter,
        title,
        content: text,
        wordCount: words,
        updatedAt: Date.now()
      });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (currentChapter) {
      onSaveChapter({
        ...currentChapter,
        title: newTitle,
        updatedAt: Date.now()
      });
    }
  };

  // Text Selection Event
  const handleSelectText = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const sel = content.slice(start, end);

    if (sel.trim().length > 3) {
      setSelectionText(sel);
      setSelectionRange({ start, end });
      setShowRewritePopup(true);
    } else {
      setShowRewritePopup(false);
    }
  };

  // Execute Local Rewrite
  const handleExecuteRewrite = async (instruction: string, spellingOnly = false) => {
    if (!selectionText) return;
    setRewriteLoading(true);
    setRewriteResult('');

    try {
      let prompt = `Bạn là biên tập viên văn học. Hãy viết lại duy nhất đoạn văn sau theo yêu cầu: "${instruction}".
${spellingOnly ? 'CHẾ ĐỘ SỬA CHÍNH TẢ BLVD: CHỈ SỬA LỖI CHÍNH TẢ, DẤU CÂU VÀ VIẾT HOA. KHÔNG THAY ĐỔI VĂN PHONG HAY TỪ VỰNG.' : 'Giữ nguyên bối cảnh và ý nghĩa gốc, nâng cao chất lượng diễn đạt.'}

Đoạn văn gốc:
"${selectionText}"

Trả về duy nhất đoạn văn bản sau khi viết lại, không ghi chú thêm gì khác.`;

      const res = await generateContentAI(prompt);
      setRewriteResult(res.trim());
    } catch (err: any) {
      setRewriteResult('Lỗi: ' + err.message);
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleApplyRewrite = () => {
    if (!selectionRange || !rewriteResult) return;
    const newText =
      content.slice(0, selectionRange.start) +
      rewriteResult +
      content.slice(selectionRange.end);

    setContent(newText);
    if (currentChapter) {
      const words = newText.trim() ? newText.trim().split(/\s+/).length : 0;
      onSaveChapter({
        ...currentChapter,
        content: newText,
        wordCount: words,
        updatedAt: Date.now()
      });
    }
    setShowRewritePopup(false);
    setRewriteResult('');
  };

  // Chapter AI Generator
  const handleGenerateChapterAI = async () => {
    if (!currentChapter) return;
    setGeneratingAI(true);
    try {
      const currentMilestones = milestones.filter((m) => m.chapterId === currentChapter.id);
      const milestoneText = currentMilestones.map((m) => `- Mốc ${m.order}: ${m.title} (${m.events})`).join('\n');

      const prompt = `Hãy viết hoàn chỉnh ${currentChapter.title}.
Bối cảnh Story Bible: Logline: "${bible?.logline || ''}", Quy tắc: "${bible?.worldRules || ''}".
Thể loại: ${story?.genres.join(', ')}.
Phong cách hành văn: ${story?.writingStyle.join(', ')}.

Tóm tắt chương: ${currentChapter.summary}
Các mốc sự kiện (Milestones):
${milestoneText || 'Tự do sáng tạo theo tóm tắt chương.'}

Độ dài yêu cầu: khoảng ${story?.targetWordCountPerChapter || 2000} từ bằng tiếng Việt tự nhiên mượt mà. Không tự ý xuất hiện ký tự lạ.`;

      const res = await generateContentAI(prompt);
      setContent(res);
      const words = res.trim() ? res.trim().split(/\s+/).length : 0;
      onSaveChapter({
        ...currentChapter,
        content: res,
        wordCount: words,
        updatedAt: Date.now()
      });
    } catch (err: any) {
      alert('Lỗi tạo văn bản: ' + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  if (!story || chapters.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Chưa có truyện hoặc chương nào. Vui lòng chọn hoặc tạo bộ truyện trong Quản Lý Truyện.
      </div>
    );
  }

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;
  const readingTimeMinutes = Math.ceil(words / 200);

  const currentMilestones = milestones.filter((m) => m.chapterId === currentChapter?.id);
  const currentScenes = scenes.filter((s) => s.chapterId === currentChapter?.id);

  return (
    <div className={`flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 text-slate-100 ${focusMode ? 'p-0' : ''}`}>
      {/* Top Toolbar */}
      {!focusMode && (
        <div className="h-12 border-b border-slate-800 bg-slate-900 px-4 flex items-center justify-between shrink-0 select-none">
          {/* Chapter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {chapters.map((chap) => (
              <button
                key={chap.id}
                onClick={() => setSelectedChapterId(chap.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  chap.id === currentChapter?.id
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Chương {chap.order}: {chap.title.slice(0, 15)}...
              </button>
            ))}
            <button
              onClick={onAddChapter}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 font-bold text-xs flex items-center gap-1 px-2"
              title="Thêm chương mới"
            >
              <Plus className="w-3.5 h-3.5" /> + Chương
            </button>
          </div>

          {/* AI Generator Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateChapterAI}
              disabled={generatingAI}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow disabled:opacity-50"
            >
              {generatingAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-amber-300" />}
              Viết Chương Với AI
            </button>

            <button
              onClick={() => setFocusMode(!focusMode)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              title="Chế độ tập trung (Focus Mode)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Editor Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Rich Text Editor Canvas */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
          {focusMode && (
            <button
              onClick={() => setFocusMode(false)}
              className="fixed top-4 right-4 p-2 bg-slate-800/80 text-slate-300 rounded-xl hover:bg-slate-700 z-50"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}

          {/* Chapter Title Field */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Tên chương tiểu thuyết..."
            className="w-full bg-transparent text-xl sm:text-2xl font-black text-white border-b border-slate-800 pb-2 focus:outline-none focus:border-indigo-500 font-serif tracking-tight"
          />

          {/* Editor TextArea */}
          <textarea
            value={content}
            onChange={handleContentChange}
            onSelect={handleSelectText}
            placeholder="Bắt đầu viết nội dung chương ở đây..."
            className="w-full flex-1 min-h-[500px] bg-transparent text-slate-200 text-sm sm:text-base leading-relaxed font-serif focus:outline-none resize-none"
          />

          {/* Bottom Word Count Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80 font-sans">
            <span>{words.toLocaleString()} từ | {chars.toLocaleString()} ký tự</span>
            <span>Khoảng {readingTimeMinutes} phút đọc</span>
          </div>
        </div>

        {/* Right Milestones & Inspector Sidebar */}
        {!focusMode && (
          <div className="w-80 border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto space-y-4 hidden lg:block shrink-0 select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                Mốc Chương (Milestones)
              </h3>
            </div>

            <div className="space-y-2">
              {currentMilestones.map((m) => (
                <div key={m.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-amber-400 flex items-center justify-between">
                    <span>Mốc {m.order}: {m.title}</span>
                  </div>
                  <p className="text-slate-300">{m.events}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Selection AI Rewrite Popup */}
      {showRewritePopup && selectionText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-indigo-500/50 rounded-2xl p-4 shadow-2xl z-50 max-w-xl w-full space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              LỆNH SỬA AI ĐOẠN ĐÃ CHỌN
            </span>
            <button onClick={() => setShowRewritePopup(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-300 italic line-clamp-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
            "{selectionText}"
          </p>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleExecuteRewrite('Sửa lỗi chính tả và dấu câu', true)}
              className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[11px] font-semibold"
            >
              Chỉnh Sửa Chính Tả BLVD
            </button>
            <button
              onClick={() => handleExecuteRewrite('Làm mượt câu văn')}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-[11px]"
            >
              Làm Mượt Câu Văn
            </button>
            <button
              onClick={() => handleExecuteRewrite('Tăng cảm xúc và chiều sâu')}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-[11px]"
            >
              Tăng Cảm Xúc
            </button>
            <button
              onClick={() => handleExecuteRewrite('Tăng tính hài hước châm biếm')}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-[11px]"
            >
              Tăng Hài Hước
            </button>
            <button
              onClick={() => handleExecuteRewrite('Rút gọn súc tích')}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-[11px]"
            >
              Rút Gọn
            </button>
            <button
              onClick={() => handleExecuteRewrite('Mở rộng miêu tả hình ảnh')}
              className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded text-[11px]"
            >
              Mở Rộng
            </button>
          </div>

          {rewriteLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-400 pt-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xử lý viết lại...
            </div>
          )}

          {rewriteResult && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="p-2.5 bg-slate-950 border border-indigo-900/50 rounded-xl text-xs text-slate-200 leading-relaxed max-h-32 overflow-y-auto">
                {rewriteResult}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleApplyRewrite}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow"
                >
                  ÁP DỤNG THAY THẾ
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
