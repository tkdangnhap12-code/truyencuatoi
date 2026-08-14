import React, { useState } from 'react';
import { Story, Chapter, ViewMode } from '../types';
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  Archive, 
  RotateCcw, 
  Wand2,
  FileText,
  Tag
} from 'lucide-react';

interface StoryManagerViewProps {
  stories: Story[];
  chapters: Chapter[];
  currentStory: Story | null;
  onSelectStory: (s: Story) => void;
  onCreateStory: (title: string, author: string, synopsis: string, genres: string[], styles: string[]) => void;
  onUpdateStory: (s: Story) => void;
  onDuplicateStory: (id: string) => void;
  onDeleteStory: (id: string) => void;
  onArchiveStory: (id: string, archive: boolean) => void;
  onNavigate: (v: ViewMode) => void;
}

export const StoryManagerView: React.FC<StoryManagerViewProps> = ({
  stories,
  chapters,
  currentStory,
  onSelectStory,
  onCreateStory,
  onUpdateStory,
  onDuplicateStory,
  onDeleteStory,
  onArchiveStory,
  onNavigate
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [targetChapters, setTargetChapters] = useState(30);
  const [targetWordCount, setTargetWordCount] = useState(2500);
  const [status, setStatus] = useState<'draft' | 'writing' | 'completed' | 'paused'>('writing');

  const handleOpenCreate = () => {
    setEditingStory(null);
    setTitle('');
    setAuthor('Tác giả');
    setSynopsis('');
    setTargetChapters(30);
    setTargetWordCount(2500);
    setStatus('writing');
    setShowModal(true);
  };

  const handleOpenEdit = (s: Story, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStory(s);
    setTitle(s.title);
    setAuthor(s.author);
    setSynopsis(s.synopsis);
    setTargetChapters(s.targetChapters || 30);
    setTargetWordCount(s.targetWordCountPerChapter || 2500);
    setStatus(s.status || 'writing');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingStory) {
      onUpdateStory({
        ...editingStory,
        title,
        author,
        synopsis,
        targetChapters,
        targetWordCountPerChapter: targetWordCount,
        status,
        updatedAt: Date.now()
      });
    } else {
      onCreateStory(title, author, synopsis, [], []);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            Danh Sách Truyện / Tiểu Thuyết
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý các bộ truyện trong dự án hiện tại. Chọn bộ truyện để sáng tác hoặc tạo mới bằng Wizard 11 bước.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('wizard')}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
          >
            <Wand2 className="w-4 h-4" />
            Tạo Theo Wizard 11 Bước
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Tạo Truyện Nhanh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stories.map((story) => {
          const storyChapters = chapters.filter((c) => c.storyId === story.id);
          const totalWords = storyChapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
          const isSelected = story.id === currentStory?.id;

          return (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-xl shadow-amber-950/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white truncate max-w-[190px]">{story.title}</h3>
                    <p className="text-xs text-slate-400">Tác giả: {story.author}</p>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleOpenEdit(story, e)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                      title="Sửa thông tin"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateStory(story.id)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                      title="Nhân bản truyện"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onArchiveStory(story.id, !story.archived)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg transition-colors"
                      title={story.archived ? 'Khôi phục' : 'Lưu trữ'}
                    >
                      {story.archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteStory(story.id)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {story.synopsis || 'Chưa có tóm tắt cốt truyện.'}
                </p>

                {/* Genre pills */}
                {story.genres && story.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {story.genres.slice(0, 3).map((g, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-800 border border-slate-700/60 rounded text-[10px] text-slate-300 font-medium flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        {g}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Story metrics */}
              <div className="grid grid-cols-2 gap-2 py-2.5 bg-slate-950/60 rounded-xl px-3 border border-slate-800/80 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">SỐ CHƯƠNG</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    {storyChapters.length} / {story.targetChapters || 30}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">TỔNG SỐ TỪ</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3" />
                    {totalWords.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span className="capitalize">
                  Trạng thái:{' '}
                  <strong className="text-indigo-400">
                    {story.status === 'writing' ? 'Đang viết' : story.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    onSelectStory(story);
                    onNavigate('editor');
                  }}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Mở Studio Viết →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Quick Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              {editingStory ? 'Sửa Thông Tin Truyện' : 'Tạo Truyện Mới Nhanh'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Truyện *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Thiên Cung Nghịch Mệnh Ký..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tác Giả</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Tên bút danh tác giả..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tóm Tắt Cốt Truyện</label>
                <textarea
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Mô tả vắn tắt ý tưởng chính..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mục Tiêu Số Chương</label>
                  <input
                    type="number"
                    value={targetChapters}
                    onChange={(e) => setTargetChapters(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Độ Dài Chương (Từ)</label>
                  <input
                    type="number"
                    value={targetWordCount}
                    onChange={(e) => setTargetWordCount(parseInt(e.target.value) || 2500)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Lưu Truyện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
