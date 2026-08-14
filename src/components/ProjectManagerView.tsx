import React, { useState } from 'react';
import { Project, Story, Chapter } from '../types';
import { 
  FolderGit2, 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  Archive, 
  RotateCcw, 
  FolderOpen,
  Calendar,
  BookOpen,
  FileText
} from 'lucide-react';

interface ProjectManagerViewProps {
  projects: Project[];
  stories: Story[];
  chapters: Chapter[];
  currentProject: Project | null;
  onSelectProject: (p: Project) => void;
  onCreateProject: (name: string, description: string, genres: string[], styles: string[]) => void;
  onUpdateProject: (p: Project) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onArchiveProject: (id: string, archive: boolean) => void;
}

export const ProjectManagerView: React.FC<ProjectManagerViewProps> = ({
  projects,
  stories,
  chapters,
  currentProject,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDuplicateProject,
  onDeleteProject,
  onArchiveProject
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setName(p.name);
    setDescription(p.description);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingProject) {
      onUpdateProject({
        ...editingProject,
        name,
        description,
        updatedAt: Date.now()
      });
    } else {
      onCreateProject(name, description, [], []);
    }
    setShowModal(false);
  };

  const filteredProjects = projects.filter((p) => Boolean(p.archived) === showArchived);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-indigo-400" />
            Quản Lý Dự Án Sáng Tác
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Mỗi dự án có thể chứa nhiều tiểu thuyết, thế giới và dòng thời gian độc lập.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors"
          >
            {showArchived ? 'Hiện dự án đang mở' : 'Xem dự án lưu trữ'}
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Tạo Dự Án Mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => {
          const projectStories = stories.filter((s) => s.projectId === p.id);
          const projectStoryIds = new Set(projectStories.map((s) => s.id));
          const projectChapters = chapters.filter((c) => projectStoryIds.has(c.storyId));
          const totalWords = projectChapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
          const isSelected = p.id === currentProject?.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-xl shadow-indigo-950/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white truncate max-w-[200px]">{p.name}</h3>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleOpenEdit(p, e)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                      title="Sửa tên & mô tả"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDuplicateProject(p.id)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                      title="Nhân bản dự án"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onArchiveProject(p.id, !p.archived)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg transition-colors"
                      title={p.archived ? 'Khôi phục' : 'Lưu trữ'}
                    >
                      {p.archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                      title="Xóa vĩnh viễn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description || 'Chưa có mô tả chi tiết cho dự án này.'}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 bg-slate-950/60 rounded-xl px-3 border border-slate-800/80 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">TRUYỆN</div>
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                    <BookOpen className="w-3 h-3 text-amber-400" />
                    {projectStories.length}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">CHƯƠNG</div>
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                    <FolderOpen className="w-3 h-3 text-indigo-400" />
                    {projectChapters.length}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">TỔNG TỪ</div>
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-center gap-1 mt-0.5">
                    <FileText className="w-3 h-3 text-emerald-400" />
                    {totalWords.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(p.createdAt).toLocaleDateString('vi-VN')}
                </span>
                {isSelected ? (
                  <span className="text-indigo-400 font-bold">Đang Mở</span>
                ) : (
                  <span className="text-slate-400 group-hover:text-slate-200">Bấm để mở</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">
              {editingProject ? 'Chỉnh Sửa Dự Án' : 'Tạo Dự Án Mới'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Dự Án *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Vũ Trụ Tu Tiên Giả Tưởng..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Dự Án</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả tầm nhìn, chủ đề chung..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
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
                Lưu Dự Án
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
