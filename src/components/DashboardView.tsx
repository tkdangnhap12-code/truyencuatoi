import React from 'react';
import { Project, Story, Chapter, ViewMode } from '../types';
import { 
  FolderGit2, 
  BookOpen, 
  FileText, 
  Clock, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  Flame, 
  CheckCircle2, 
  Tag
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  stories: Story[];
  chapters: Chapter[];
  currentProject: Project | null;
  currentStory: Story | null;
  onSelectProject: (p: Project) => void;
  onSelectStory: (s: Story) => void;
  onNavigate: (view: ViewMode) => void;
  onNewProject: () => void;
  onNewStory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  stories,
  chapters,
  currentProject,
  currentStory,
  onSelectProject,
  onSelectStory,
  onNavigate,
  onNewProject,
  onNewStory
}) => {
  const totalWords = chapters.reduce((acc, c) => acc + (c.wordCount || 0), 0);
  const totalChapters = chapters.length;
  const activeGenres = currentStory?.genres?.length ? currentStory.genres.join(', ') : 'Chưa thiết lập';
  const activeStyle = currentStory?.writingStyle?.length ? currentStory.writingStyle.join(', ') : 'Chưa thiết lập';

  const recentStories = [...stories].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
  const recentChapters = [...chapters].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI NOVEL STUDIO - TỐNG QUAN VIẾT TRUYỆN
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Chào mừng trở lại Studio, Tác Giả!
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Hệ thống hỗ trợ sáng tác tiểu thuyết client-side chuyên nghiệp. Quản lý cốt truyện, nhân vật, bối cảnh và sáng tác không giới hạn cùng trợ lý AI Gemini.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('editor')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              Tiếp tục viết chương mới
            </button>
            <button
              onClick={onNewStory}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              + Truyện mới
            </button>
            <button
              onClick={onNewProject}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              + Dự án mới
            </button>
            <button
              onClick={() => onNavigate('wizard')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Wizard Tạo Truyện 11 Bước
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TỔNG SỐ TỪ</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalWords.toLocaleString()} <span className="text-xs font-normal text-slate-400">từ</span></div>
          <div className="text-[11px] text-slate-400">Đã tích lũy trong toàn bộ chương</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TỔNG SỐ CHƯƠNG</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalChapters} <span className="text-xs font-normal text-slate-400">chương</span></div>
          <div className="text-[11px] text-slate-400">Đã lập outline và khởi tạo</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>THỂ LOẠI ĐANG DÙNG</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-white truncate" title={activeGenres}>
            {activeGenres}
          </div>
          <div className="text-[11px] text-slate-400">Thiết lập theo truyện hiện tại</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>VĂN PHONG ĐANG DÙNG</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-white truncate" title={activeStyle}>
            {activeStyle}
          </div>
          <div className="text-[11px] text-slate-400">Phong cách hành văn chọn lọc</div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Stories Column */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Truyện Gần Đây
            </h2>
            <button
              onClick={() => onNavigate('stories')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentStories.map((story) => (
              <div
                key={story.id}
                onClick={() => {
                  onSelectStory(story);
                  onNavigate('editor');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 ${
                  story.id === currentStory?.id
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white truncate max-w-[180px]">{story.title}</h3>
                    <p className="text-xs text-slate-400">Tác giả: {story.author}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {story.status === 'writing' ? 'Đang viết' : 'Bản nháp'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{story.synopsis}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>Mục tiêu: {story.targetChapters} chương</span>
                  <span>Cập nhật: {new Date(story.updatedAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Chapters & Activity Column */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            Chương Mới Chỉnh Sửa
          </h2>

          <div className="space-y-3">
            {recentChapters.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Chưa có chương nào được tạo.</p>
            ) : (
              recentChapters.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => onNavigate('editor')}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 rounded-xl cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs text-slate-200 truncate max-w-[200px]">
                      {chap.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{chap.wordCount} từ</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{chap.summary || 'Chưa có tóm tắt'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
