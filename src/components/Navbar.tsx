import React from 'react';
import { Project, Story } from '../types';
import { 
  BookOpen, 
  FolderGit2, 
  Settings, 
  Download, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  projects: Project[];
  stories: Story[];
  currentProject: Project | null;
  currentStory: Story | null;
  onSelectProject: (p: Project) => void;
  onSelectStory: (s: Story) => void;
  onOpenSettings: () => void;
  onOpenExportHtml: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  savingStatus?: string;
  onQuickNewStory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  stories,
  currentProject,
  currentStory,
  onSelectProject,
  onSelectStory,
  onOpenSettings,
  onOpenExportHtml,
  theme,
  onToggleTheme,
  savingStatus = 'Đã lưu',
  onQuickNewStory
}) => {
  const [projectMenuOpen, setProjectMenuOpen] = React.useState(false);
  const [storyMenuOpen, setStoryMenuOpen] = React.useState(false);

  const filteredStories = stories.filter(s => s.projectId === currentProject?.id);

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 text-slate-100 flex items-center justify-between px-4 sticky top-0 z-40 select-none">
      {/* Left branding and breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-black text-base tracking-wider bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          <div className="p-1.5 bg-indigo-600/20 rounded-lg border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="hidden sm:inline">AI NOVEL STUDIO</span>
        </div>

        <div className="h-4 w-px bg-slate-800 hidden md:block" />

        {/* Project Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setProjectMenuOpen(!projectMenuOpen); setStoryMenuOpen(false); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 font-medium transition-colors"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate">
              {currentProject ? currentProject.name : 'Chọn Dự án'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {projectMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                DANH SÁCH DỰ ÁN
              </div>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setProjectMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    p.id === currentProject?.id ? 'text-indigo-400 font-semibold bg-indigo-950/40' : 'text-slate-300'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  {p.id === currentProject?.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Story Dropdown */}
        {currentProject && (
          <div className="relative">
            <button
              onClick={() => { setStoryMenuOpen(!storyMenuOpen); setProjectMenuOpen(false); }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">
                {currentStory ? currentStory.title : 'Chọn Truyện'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {storyMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>TRUYỆN TRONG DỰ ÁN</span>
                  <button
                    onClick={() => {
                      setStoryMenuOpen(false);
                      onQuickNewStory();
                    }}
                    className="text-indigo-400 hover:underline"
                  >
                    + Mới
                  </button>
                </div>
                {filteredStories.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-500 italic">Chưa có truyện nào</div>
                ) : (
                  filteredStories.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectStory(s);
                        setStoryMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        s.id === currentStory?.id ? 'text-amber-400 font-semibold bg-amber-950/40' : 'text-slate-300'
                      }`}
                    >
                      <span className="truncate">{s.title}</span>
                      {s.id === currentStory?.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-md">
          <CheckCircle2 className="w-3 h-3" />
          <span>{savingStatus}</span>
        </div>

        {/* Single HTML Export for GitHub Pages */}
        <button
          onClick={onOpenExportHtml}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md transition-all"
          title="Xuất file index.html sẵn sàng cho GitHub Pages"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Tải index.html (GitHub Pages)</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          title="Đổi Giao diện"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          title="Cài đặt Gemini API Key & Hệ thống"
        >
          <Settings className="w-4 h-4 text-slate-300" />
        </button>
      </div>
    </header>
  );
};
